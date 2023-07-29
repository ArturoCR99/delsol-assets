import { ConflictException, Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Equal, FindOperator, In, Repository } from 'typeorm';
import { InitService } from 'src/tools/utils/init_service';
import { CreateUserAddressDto, CreateUserDto, CreateUserPhoneNumberDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt'
import { Rol } from './entities/rol.entity';
import { ROLS } from './entities/rol.mock';
import { Address } from './entities/address.entity';
import { PhoneNumber } from './entities/phone_number.entity';
import { BranchesService } from 'src/branches/branches.service';
import { OrdersService } from 'src/orders/services/orders.service';
import { ORDER_STATUS } from 'src/orders/enums/order_status.enum';
import { ImagesService } from 'src/images/images.service';
import { Order } from 'src/orders/entities/order.entity';
import { ItemsService } from 'src/items/items.service';
import { ConfigRestaurant } from 'src/configs/entities/config.entity';

@Injectable()
export class UsersService extends InitService<User, CreateUserDto> {

  constructor(
    @InjectRepository(User)
    private _userRepository: Repository<User>,
    @InjectRepository(Order)
    private _orderRespository: Repository<Order>,
    @InjectRepository(Rol)
    private _rolRespository: Repository<Rol>,
    @InjectRepository(Address)
    private _addressRepository: Repository<Address>,
    @InjectRepository(PhoneNumber)
    private _phoneNumberRepository: Repository<PhoneNumber>,

    @Inject(forwardRef(() => BranchesService))
    private _branchService: BranchesService,
    @Inject(forwardRef(() => OrdersService))
    private _orderService: OrdersService,
    private _imageService: ImagesService,

    @Inject(forwardRef(() => ItemsService))
    private _itemService: ItemsService,
    @InjectRepository(ConfigRestaurant)
    private _configRepository: Repository<ConfigRestaurant>
  ) {
    super(_userRepository)
  }

  /**
   * 
   * @param email Un correo para buscar al usuario y ver si ya existe
   * @param userdata Informacion otrogada del cliente
   * @returns Retorna al usuario y un booleano que indica si fue creado o no
   */
  async findOneOrCreate(email: string, userdata: CreateUserDto): Promise<[User, boolean]> {
    const tempUser = await this._userRepository.findOne({ where: { email: email } })
    let user: User | undefined = undefined
    if (!tempUser) {
      user = await this.createWithPassport(userdata)
      user.password = user.password != null ? bcrypt.hashSync(user.password, 5) : null;
      user.rols = [ROLS.CUSTOMER]
      user = await this._userRepository.save(user)
      return [user, true];
    }
    return [tempUser, false]
  }

  async createWithPassport(data: CreateUserDto) {
    let user = this._userRepository.create()
    user.name = data.name
    user.last_name = data.last_name
    user.email = data.email
    user.birth_date = data?.birth_date
    user.rols = [ROLS.CUSTOMER]
    return await this._userRepository.save(user)
  }

  async create(data: CreateUserDto): Promise<User> {
    if ((await this.findAll({ where: { email: data.email }, take: 1 })).length > 0)
      throw new ConflictException("Email already exists, please login")
    let user = this._userRepository.create()
    user.name = data.name
    user.last_name = data.last_name
    user.email = data.email
    user.birth_date = data?.birth_date
    if(data?.branch)
      user.branch = await this._branchService.findOne(data.branch)
    user.image = data.image
    ? await this._imageService.findOne(data.image)
    : null;
    if (data?.password)
      user.password = bcrypt.hashSync(data.password, 5);
    user.rols = data.rols? data.rols: [ROLS.CUSTOMER]
    return await this._userRepository.save(user)
  }

  async saveToken(id: number, token: string) {
    const user = await this.findOne(id);
    if (!user) {
      return false
    }
    user.mobileToken = token;
    await this._userRepository.update(id, { mobileToken: token })
    return true
  }
  /*
    SHOPPING CART
  */

  async addToWallet(client: User, total: number) {
    const configs = await this._configRepository.find()
    
    const everyQuantityApplyClientWallet = configs[0]?.everyQuantityApplyClientWallet || 0
    const percentageWalletToApply = configs[0]?.percentageWallet || 0
    
    let incomingWalletMoney = Math.floor(total / everyQuantityApplyClientWallet) * (percentageWalletToApply *  everyQuantityApplyClientWallet / 100)

    if(incomingWalletMoney <= 0 || isNaN(incomingWalletMoney)){
      incomingWalletMoney = 0
    }

    client.wallet += incomingWalletMoney
    await this._userRepository.save(client)
  }

  async requestMoneyFromWallet(client: User, requestedMoney: number) {
    if (client.wallet < requestedMoney)
      throw new ConflictException(`Can not request ${requestedMoney} in your wallet.`)
    client.wallet -= requestedMoney
    await this._userRepository.save(client)
  }

  async getShoppingCartByBranch(user: User, branch_id: number) {
    const branch = await this._branchService.findOne(branch_id)
    const orderByBranch = this._orderRespository.findOne({
      relations: [
        "branch",
        "coupon", 
        "orderToItems", 
        "orderToItems.item", 
        "orderToItems.item.image", 
        "orderToItems.item.addonTypes", 
        "orderToItems.item.addonTypes.addons", 
        "orderToItems.order_addon_to_item",
        "orderToItems.order_addon_to_item.addon"
      ],
      select: {
        client: {
          id: true
        },
        branch: {
          id: true,
          name: true,
          address: true,
          payment_option: true,
          delivery_option: true,
        },
        orderToItems: {
          id: true,
          item: true,
          quantity: true,
          order_addon_to_item: {
            id: true,
            addon: true,
            quantity: true
          }
        }
      } as any,
      order: {
        createdAt: 'ASC'
      },
      loadEagerRelations: false,
      where: {
        client: Equal(user.id),
        branch: Equal(branch.id),
        status: In([ORDER_STATUS.EDITANDO, ORDER_STATUS.POR_PAGAR])
      }
    })
    return orderByBranch
  }
  
  async getShoppingCart(user: User, status?: ORDER_STATUS) {
    const query = this._orderRespository.createQueryBuilder("order")
      .leftJoinAndSelect("order.branch", "branch")
      .leftJoinAndSelect("order.orderToItems", "orderToItems")
      .leftJoinAndSelect("orderToItems.item", "item")
      .leftJoinAndSelect("orderToItems.order_addon_to_item", "order_addon_to_item")
      .leftJoinAndSelect("order_addon_to_item.addon", "addon")
      .where("order.client = :client", { client: user.id })

    if (status)
      query.where("order.status = :status", { status })
    
    return query.getMany()
  }

  /*
    ROLS
  */
  async appendRol(user_id: number, rol_id: number) {
    let user = await this.findOne(user_id)
    user.rols.push(ROLS.CUSTOMER)
    return this._userRepository.save(user)
  }

  async removeRolFromUser(user_id: number, rol_id: number) {
    let user = await this.findOne(user_id)
    let rol = await this.getRol(rol_id)
    return this._userRepository.save(user)
  }

  async getRols() {
    return this._rolRespository.find()
  }

  async getRol(id: number) {
    return this._rolRespository.findOneOrFail({ where: { id } })
  }

  /*
    ADDRESS
  */
  async appendAddress(user: User, data: CreateUserAddressDto) {
    let address = this._addressRepository.create(data)
    address = await this._addressRepository.save(address)
    user.addresses.push(address)
    return this._userRepository.save(user)
  }

  /*
    Phone Numbers
  */
  async appendPhoneNumber(user: User, data: CreateUserPhoneNumberDto) {
    let phone_numbers = this._phoneNumberRepository.create(data)
    phone_numbers = await this._phoneNumberRepository.save(phone_numbers)
    user.phone_numbers.push(phone_numbers)
    return this._userRepository.save(user)
  }

  /**
    Favorites
   */

  async getFavorites(user: User) {
    user = await this.findOne(user.id, { relations: ['favorites'] })
    return user.favorites
  }

  async addItemToFavorites(user: User, item_id: number) {
    user = await this.findOne(user.id, { relations: ['favorites'] })
    const item = await this._itemService.findOne(item_id)
    if (user.favorites.every(i => i.id !== item.id)) {
      user.favorites.push(item)
      user = await this._userRepository.save(user)
    }
    return user
  }

  async removeItemFromFavorites(user: User, item_id: number) {
    user = await this.findOne(user.id, { relations: ['favorites'] })
    const item = await this._itemService.findOne(item_id)
    user.favorites = user.favorites.filter(i => i.id !== item.id)
    return await this._userRepository.save(user)
  }



  async getHistorial(user: User) {
    return (await this._userRepository.findOne({ where: { id: user.id, active: true }, relations: ['orders'] })).orders
  }

  async getClients() {
    return this._userRepository
      .createQueryBuilder('user')
      .innerJoin('user.rols', 'rol')
      .leftJoin('user.branch', 'branch')
      .where('rol.id IN (:...rols)', { rols: [ROLS.CUSTOMER] })
      .andWhere('user.active = :userActive', { userActive: true })
      .select([
        'user',
        'branch.id',
        'branch.name'
      ])
      .addOrderBy("user.id", "ASC")
      .getMany()

  }

  async getBirthdayClients() {
    return this._userRepository
      .createQueryBuilder('user')
      .innerJoin('user.rols', 'rol')
      .leftJoin('user.branch', 'branch')
      .where('rol.id IN (:...rols)', { rols: [ROLS.CUSTOMER] })
      .andWhere('user.active = :userActive', { userActive: true })
      .andWhere("DATE_PART('day', user.birth_date) = DATE_PART('day', CURRENT_DATE)")
      .andWhere("DATE_PART('month', user.birth_date) = DATE_PART('month', CURRENT_DATE)")
      .addOrderBy('user.id', 'ASC')
      .select([
        'user',
        'branch.id',
        'branch.name'
      ])
      .addOrderBy("user.id", "ASC")
      .getMany()
  }

  getWallet(user: User) {
    return this._orderRespository.createQueryBuilder('order')
      .leftJoinAndSelect('order.branch', 'branch')
      .leftJoinAndSelect('order.client', 'client')
      .where('client.id = :userId', { userId: user.id })
      .andWhere('order.wallet_money_used > 0')
      .getMany()
  }

}

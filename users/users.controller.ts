import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, ClassSerializerInterceptor, Query, ValidationPipe, UseGuards, Req, ParseIntPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserAddressDto, CreateUserBulkDto, CreateUserDto, CreateUserPhoneNumberDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags } from '@nestjs/swagger';
import { QueryUserDto } from './dto/query-user.dto';
import { BranchesService } from 'src/branches/branches.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ORDER_STATUS } from 'src/orders/enums/order_status.enum';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@ApiTags('Users')
@UseInterceptors(ClassSerializerInterceptor)
@Controller('users')
export class UsersController {
  constructor(
    private readonly _usersService: UsersService,
    private _branchService: BranchesService,
    @InjectRepository(User) private userRepo: Repository<User>,
  ) { }

  @Get("birthday")
  async getBirthdayClients() {
    return this._usersService.getBirthdayClients()
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    let user = await this._usersService.create(createUserDto)
    return user
  }

  @Post('bulk')
  async createBulk(@Body() createUserBulkDtoL: CreateUserBulkDto) {
    let users = [];
    for (let i = 0; i < createUserBulkDtoL.users.length; i++) {
      const user = this._usersService.create(createUserBulkDtoL.users[i])
      users.push(user)
    }
    return users;
  }

  @Get()
  async findAll(
    @Query(
      new ValidationPipe({
        transform: true,
        transformOptions: { enableImplicitConversion: true },
        forbidNonWhitelisted: true,
      }),
    )
    queryParams: QueryUserDto,
  ) {
    const query = this.userRepo.createQueryBuilder('user')
      .leftJoinAndSelect('user.branch', 'branch')
      .leftJoinAndSelect('user.image', 'image')
    
    if(queryParams?.branch){
      query.andWhere('branch.id = :branch', { branch: queryParams.branch })
    }

    let users = await query.getMany()
    
    if(queryParams?.roles && queryParams?.roles.length > 0){
      users =  users.filter(user => {
        return user.rols.some(role => queryParams.roles.includes(role))
      })
    }

    const dataUser = users.map((user) => {
      delete user.password;
      return user;
    });

    return dataUser;
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    let user = await this._usersService.findOne(+id);
    if (user)
      delete user.password
    return user;
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    let user = await this._usersService.update(+id, updateUserDto);
    if (user)
      delete user.password
    return user
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    let user = await this._usersService.remove(+id);
    return user
  }

  @Post(':id/mobile-token')
  saveMobileToken(@Param('id') id: number, @Body('token') token: string): Promise<boolean> {
    return this._usersService.saveToken(id, token);

  }

  @Post("self/address")
  @UseGuards(JwtAuthGuard)
  async addAddress(@Req() req: any, @Body() createUserAddressDto: CreateUserAddressDto) {
    return this._usersService.appendAddress(req.user, createUserAddressDto)
  }

  @Post("self/phones")
  @UseGuards(JwtAuthGuard)
  async addPhoneNumber(@Req() req: any, @Body() createUserPhoneNumberDto: CreateUserPhoneNumberDto) {
    return this._usersService.appendPhoneNumber(req.user, createUserPhoneNumberDto)
  }

  @Get("self/shopping-cart/:branch_id")
  @UseGuards(JwtAuthGuard)
  async getShoppingCartByBranch(@Param("branch_id", ParseIntPipe) branch_id: number, @Req() req: any) {
    return this._usersService.getShoppingCartByBranch(req.user, branch_id)
  }
  
  @Get("self/orders/history")
  @UseGuards(JwtAuthGuard)
  async getShoppingCart( @Req() req: any, @Query('status')status?: ORDER_STATUS) {
    return this._usersService.getShoppingCart(req.user, status)
  }


  // Orders
  @Get("self/favorites/")
  @UseGuards(JwtAuthGuard)
  async getFavorites(@Req() req: any) {
    return this._usersService.getFavorites(req.user)
  }

  @Post("self/favorites/:item_id")
  @UseGuards(JwtAuthGuard)
  async addItemToFavorites(@Param("item_id", ParseIntPipe) item_id: number, @Req() req: any) {
    return this._usersService.addItemToFavorites(req.user, item_id)
  }

  @Delete("self/favorites/:item_id")
  @UseGuards(JwtAuthGuard)
  async removeItemFromFavorites(@Param("item_id", ParseIntPipe) item_id: number, @Req() req: any) {
    return this._usersService.removeItemFromFavorites(req.user, item_id)
  }

  @Post("self/historial")
  @UseGuards(JwtAuthGuard)
  async getHistorial(@Req() req: any) {
    return this._usersService.getHistorial(req.user)
  }
  
  @Get('self/orders-wallet')
  @UseGuards(JwtAuthGuard)
  async getWallet(@Req() req: any) {
    return this._usersService.getWallet(req.user)
  }

}

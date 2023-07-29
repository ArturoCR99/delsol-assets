import { ClassSerializerInterceptor, Controller, Get, UseInterceptors } from '@nestjs/common';
import { BranchesService } from 'src/branches/branches.service';
import { UsersService } from './users.service';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('clients')
export class ClientController {

    constructor(
        private readonly _usersService: UsersService,
        private _branchService: BranchesService
    ) { }


    @Get("")
    async getClients() {
        return this._usersService.getClients()
    }

    @Get("birthday")
    async getBirthdayClients() {
        return this._usersService.getBirthdayClients()
    }
}
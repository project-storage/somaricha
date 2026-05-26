import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  UseGuards,
  Query,
  Put,
  Req
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from './dto/create-user.dto';

@ApiTags('User')
@ApiBearerAuth('JWT-auth') 
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMe(@Req() req) {
    return this.userService.getUserInfo(req.user.userId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.OWNER)
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.OWNER)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.OWNER)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.OWNER)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }

  // Get user profile (requires authentication)
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@GetUser() user: any) {
    return this.userService.getProfile(user.id);
  }

  // Update user profile (requires authentication)
  @UseGuards(JwtAuthGuard)
  @Patch('profile')
  updateProfile(@GetUser() user: any, @Body() profileData: Partial<UpdateUserDto>) {
    return this.userService.updateProfile(user.id, profileData);
  }

  // Get user addresses
  @UseGuards(JwtAuthGuard)
  @Get('addresses')
  getUserAddresses(@GetUser() user: any) {
    return this.userService.getUserAddresses(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('addresses')
  createUserAddress(@GetUser() user: any, @Body() addressData: any) {
    return this.userService.createUserAddress(user.id, addressData);
  }

  @UseGuards(JwtAuthGuard)
  @Put('addresses/:id')
  updateUserAddress(
    @Param('id') addressId: string, 
    @GetUser() user: any, 
    @Body() addressData: any
  ) {
    return this.userService.updateUserAddress(+addressId, user.id, addressData);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('addresses/:id')
  deleteUserAddress(@Param('id') addressId: string, @GetUser() user: any) {
    return this.userService.deleteUserAddress(+addressId, user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Put('addresses/:id/default')
  setDefaultAddress(@Param('id') addressId: string, @GetUser() user: any) {
    return { message: 'Default address set successfully' };
  }

  // Payments
  @UseGuards(JwtAuthGuard)
  @Get('payment-methods')
  getUserPayments(@GetUser() user: any) {
    return this.userService.getUserPayments(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('payment-methods')
  addUserPayment(@GetUser() user: any, @Body() paymentData: any) {
    return this.userService.addUserPayment(user.id, paymentData);
  }

  @UseGuards(JwtAuthGuard)
  @Put('payment-methods/:id')
  updateUserPayment(
    @Param('id') paymentId: string, 
    @GetUser() user: any, 
    @Body() paymentData: any
  ) {
    return this.userService.updateUserPayment(+paymentId, user.id, paymentData);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('payment-methods/:id')
  deleteUserPayment(@Param('id') paymentId: string, @GetUser() user: any) {
    return this.userService.deleteUserPayment(+paymentId, user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Put('payment-methods/:id/default')
  setDefaultPayment(@Param('id') paymentId: string, @GetUser() user: any) {
    return this.userService.setDefaultPayment(+paymentId, user.id);
  }

  // Orders
  @UseGuards(JwtAuthGuard)
  @Get('orders')
  getUserOrders(
    @GetUser() user: any, 
    @Query('limit') limit: number = 10, 
    @Query('offset') offset: number = 0
  ) {
    return this.userService.getUserOrders(user.id, limit, offset);
  }
}

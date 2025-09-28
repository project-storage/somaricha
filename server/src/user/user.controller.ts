<<<<<<< HEAD
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
=======
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
  Put
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { User } from './entities/user.entity';
import { GetUser } from '../auth/decorators/get-user.decorator';
>>>>>>> develop_frontend

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

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }

  // Get user profile (requires authentication)
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@GetUser() user: User) {
    return this.userService.getProfile(user.id);
  }

  // Update user profile (requires authentication)
  @UseGuards(JwtAuthGuard)
  @Patch('profile')
  updateProfile(@GetUser() user: User, @Body() profileData: Partial<UpdateUserDto>) {
    return this.userService.updateProfile(user.id, profileData);
  }

  // Get user addresses (requires authentication)
  @UseGuards(JwtAuthGuard)
  @Get('addresses')
  getUserAddresses(@GetUser() user: User) {
    return this.userService.getUserAddresses(user.id);
  }

  // Create user address (requires authentication)
  @UseGuards(JwtAuthGuard)
  @Post('addresses')
  createUserAddress(@GetUser() user: User, @Body() addressData: any) {
    return this.userService.createUserAddress(user.id, addressData);
  }

  // Update user address (requires authentication)
  @UseGuards(JwtAuthGuard)
  @Put('addresses/:id')
  updateUserAddress(
    @Param('id') addressId: string, 
    @GetUser() user: User, 
    @Body() addressData: any
  ) {
    return this.userService.updateUserAddress(+addressId, user.id, addressData);
  }

  // Delete user address (requires authentication)
  @UseGuards(JwtAuthGuard)
  @Delete('addresses/:id')
  deleteUserAddress(@Param('id') addressId: string, @GetUser() user: User) {
    return this.userService.deleteUserAddress(+addressId, user.id);
  }

  // Set default address (requires authentication)
  @UseGuards(JwtAuthGuard)
  @Put('addresses/:id/default')
  setDefaultAddress(@Param('id') addressId: string, @GetUser() user: User) {
    // This would be implemented to set a default address
    // For now, just return success
    return { message: 'Default address set successfully' };
  }

  // Get user payment methods (requires authentication)
  @UseGuards(JwtAuthGuard)
  @Get('payment-methods')
  getUserPayments(@GetUser() user: User) {
    return this.userService.getUserPayments(user.id);
  }

  // Add user payment method (requires authentication)
  @UseGuards(JwtAuthGuard)
  @Post('payment-methods')
  addUserPayment(@GetUser() user: User, @Body() paymentData: any) {
    return this.userService.addUserPayment(user.id, paymentData);
  }

  // Update user payment method (requires authentication)
  @UseGuards(JwtAuthGuard)
  @Put('payment-methods/:id')
  updateUserPayment(
    @Param('id') paymentId: string, 
    @GetUser() user: User, 
    @Body() paymentData: any
  ) {
    return this.userService.updateUserPayment(+paymentId, user.id, paymentData);
  }

  // Delete user payment method (requires authentication)
  @UseGuards(JwtAuthGuard)
  @Delete('payment-methods/:id')
  deleteUserPayment(@Param('id') paymentId: string, @GetUser() user: User) {
    return this.userService.deleteUserPayment(+paymentId, user.id);
  }

  // Set default payment method (requires authentication)
  @UseGuards(JwtAuthGuard)
  @Put('payment-methods/:id/default')
  setDefaultPayment(@Param('id') paymentId: string, @GetUser() user: User) {
    return this.userService.setDefaultPayment(+paymentId, user.id);
  }

  // Get user order history (requires authentication)
  @UseGuards(JwtAuthGuard)
  @Get('orders')
  getUserOrders(
    @GetUser() user: User, 
    @Query('limit') limit: number = 10, 
    @Query('offset') offset: number = 0
  ) {
    return this.userService.getUserOrders(user.id, limit, offset);
  }
}

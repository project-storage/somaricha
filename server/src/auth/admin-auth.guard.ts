import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { User, UserRole } from '@prisma/client';

@Injectable()
export class AdminAuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const user: any = request.user;
    if (!user || !user.user_role) return false;
    
    // Check if user role is OWNER (admin) with robust case-insensitive matching
    return user.user_role.toLowerCase() === 'owner';
  }
}
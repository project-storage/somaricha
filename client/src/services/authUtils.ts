// authUtils.ts
export const isLoggedIn = (): boolean => {
  return !!localStorage.getItem('access_token');
};

export const checkAuthAndAlert = (): boolean => {
  if (!isLoggedIn()) {
    alert('กรุณาเข้าสู่ระบบก่อนจัดการสินค้าในตระกร้า');
    return false;
  }
  return true;
};
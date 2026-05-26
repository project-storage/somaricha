import { Component } from "react";
import type { ErrorInfo, ReactNode } from "react";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = "/";
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 py-12">
          <div className="max-w-md w-full text-center bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-8 h-8 text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              เกิดข้อผิดพลาดบางอย่าง
            </h2>
            <p className="text-gray-600 mb-8 text-sm leading-relaxed">
              ขออภัยในความไม่สะดวก ระบบพบปัญหาในการแสดงผลหน้านี้ โปรดคลิกปุ่มด้านล่างเพื่อกลับไปยังหน้าแรก
            </p>
            <button
              onClick={this.handleReset}
              className="w-full py-3 bg-[#8C6E63] hover:bg-[#3E2522] text-white rounded-full font-semibold shadow-md transition duration-300 transform hover:scale-[1.02]"
            >
              กลับหน้าแรก
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

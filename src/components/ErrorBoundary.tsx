import { Component, ErrorInfo, ReactNode } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // 로그를 남기거나 외부 서비스로 전송 가능
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center h-full p-8">
          <h2 className="text-xl font-bold mb-2 text-red-600">
            문제가 발생했습니다.
          </h2>
          <p className="mb-4">새로고침하거나 잠시 후 다시 시도해주세요.</p>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;

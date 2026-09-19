import { Component, type ErrorInfo, type ReactNode } from "react";
import { Button } from "./Button";
import { StarFour } from "@phosphor-icons/react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error in component tree:", error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <main
          id="main-content"
          className="grid min-h-screen place-items-center bg-space-950 px-6 py-16 text-center text-cream"
        >
          <div className="max-w-md">
            <span className="mx-auto grid size-16 place-items-center rounded-full border border-gold/45 text-gold">
              <StarFour size={30} weight="thin" />
            </span>
            <h1 className="mt-6 font-display text-2xl font-bold text-cream">
              화면을 불러오는 중 문제가 발생했습니다
            </h1>
            <p className="mt-2 text-sm leading-6 text-cream/70">
              일시적인 연결 오류이거나 업데이트가 적용되는 중일 수 있습니다. 새로고침을 통해 다시 시도해 주세요.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <Button onClick={this.handleReload} variant="primary">
                페이지 새로고침
              </Button>
            </div>
          </div>
        </main>
      );
    }

    return this.props.children;
  }
}

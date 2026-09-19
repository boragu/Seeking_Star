import { DownloadSimple, Export, X } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { usePwaInstall } from "../../hooks/usePwaInstall";
import { Button } from "../ui/Button";

const DISMISS_KEY = "byeol-pwa-install-dismissed";

export function PwaInstallBanner() {
  const { isInstallable, isStandalone, isIOS, canPromptDirectly, promptInstall } = usePwaInstall();
  const [dismissed, setDismissed] = useState(true);
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  useEffect(() => {
    const isDismissed = sessionStorage.getItem(DISMISS_KEY) === "true";
    if (!isDismissed && isInstallable && !isStandalone) {
      // Show after a short delay for smooth entrance
      const timer = setTimeout(() => setDismissed(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [isInstallable, isStandalone]);

  if (dismissed || isStandalone || !isInstallable) {
    return null;
  }

  const handleDismiss = () => {
    sessionStorage.setItem(DISMISS_KEY, "true");
    setDismissed(true);
  };

  const handleInstallClick = async () => {
    if (canPromptDirectly) {
      const installed = await promptInstall();
      if (installed) {
        setDismissed(true);
      }
    } else if (isIOS) {
      setShowIOSGuide(true);
    }
  };

  return (
    <>
      <div className="fixed inset-x-3 bottom-20 z-40 mx-auto max-w-lg animate-fade-in md:bottom-6 md:inset-x-auto md:right-6">
        <div className="flex items-center gap-3.5 rounded-2xl border border-gold/30 bg-[#06121ef2] p-4 text-cream shadow-[0_16px_40px_rgba(0,0,0,.45)] backdrop-blur-xl">
          <img
            src="/assets/app-icon.png"
            alt="별보러간다"
            className="size-10 shrink-0 rounded-xl border border-cream/15 object-cover"
          />

          <div className="min-w-0 flex-1">
            <div className="font-display text-[13px] font-bold text-cream">
              별보러간다 앱으로 설치
            </div>
            <p className="mt-0.5 truncate text-[11px] text-cream/70">
              홈 화면에 추가하여 더 빠르고 편리하게 이용하세요.
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-1.5">
            <Button
              className="h-8 px-3 text-[11px] font-bold"
              variant="night"
              onClick={() => void handleInstallClick()}
            >
              <DownloadSimple weight="bold" /> 설치
            </Button>
            <button
              className="grid size-8 place-items-center rounded-lg text-cream/50 transition hover:bg-white/10 hover:text-cream"
              onClick={handleDismiss}
              aria-label="안내 닫기"
              type="button"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      </div>

      {showIOSGuide && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/70 p-4 backdrop-blur-sm sm:items-center">
          <div className="w-full max-w-md rounded-2xl border border-cream/15 bg-ink p-6 text-cream shadow-2xl animate-fade-in">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <span className="grid size-8 place-items-center rounded-lg bg-gold/20 text-gold-light">
                  <Export size={18} weight="bold" />
                </span>
                <h3 className="font-display text-lg font-bold">iOS 홈 화면에 추가하기</h3>
              </div>
              <button
                className="grid size-7 place-items-center rounded-lg text-cream/50 hover:text-cream"
                onClick={() => setShowIOSGuide(false)}
                type="button"
              >
                <X size={18} />
              </button>
            </div>

            <p className="mt-3 text-[12px] leading-5 text-cream/70">
              Safari 브라우저에서 '홈 화면에 추가'를 누르면 별보러간다를 앱처럼 이용할 수 있습니다.
            </p>

            <ol className="mt-4 space-y-2.5 rounded-xl border border-cream/10 bg-white/5 p-4 text-[11px] text-cream/85">
              <li className="flex items-center gap-2.5">
                <span className="grid size-5 shrink-0 place-items-center rounded-full bg-gold text-[10px] font-bold text-ink">
                  1
                </span>
                <span>
                  Safari 하단 브라우저 메뉴의 <strong>공유 아이콘</strong> (<Export className="inline text-gold-light" />)을 탭하세요.
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="grid size-5 shrink-0 place-items-center rounded-full bg-gold text-[10px] font-bold text-ink">
                  2
                </span>
                <span>
                  메뉴에서 <strong>'홈 화면에 추가'</strong>를 선택하세요.
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="grid size-5 shrink-0 place-items-center rounded-full bg-gold text-[10px] font-bold text-ink">
                  3
                </span>
                <span>
                  우측 상단 <strong>'추가'</strong>를 누르면 홈 화면에 앱이 설치됩니다.
                </span>
              </li>
            </ol>

            <Button
              className="mt-5 w-full"
              variant="night"
              onClick={() => setShowIOSGuide(false)}
            >
              확인
            </Button>
          </div>
        </div>
      )}
    </>
  );
}

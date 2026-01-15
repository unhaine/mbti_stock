import React from 'react';
import PullToRefresh from 'react-simple-pull-to-refresh';
import { cn } from '../../utils/helpers';

export default function PullToRefreshWrapper({ children, onRefresh, className }) {
  const handleRefresh = async () => {
    // UX를 위해 최소 1초 대기
    await new Promise((resolve) => setTimeout(resolve, 1000));
    if (onRefresh) {
      await onRefresh();
    }
  };

  return (
    <PullToRefresh
      onRefresh={handleRefresh}
      className={cn("h-full overflow-y-auto", className)} // 클래스 병합
      pullingContent={
        <div className="flex items-center justify-center p-4 text-dark-400">
          <span className="text-xl mr-2">⬇️</span>
          <span className="text-sm font-medium">당겨서 새로고침</span>
        </div>
      }
      refreshingContent={
        <div className="flex items-center justify-center p-4 text-primary-400">
          <span className="animate-spin text-xl mr-2">💫</span>
          <span className="text-sm font-medium">업데이트 중...</span>
        </div>
      }
      pullDownThreshold={60}
      maxPullDownDistance={100}
      backgroundColor="transparent"
      resistance={2.5}
    >
      {children}
    </PullToRefresh>
  );
}

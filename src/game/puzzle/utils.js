// 퍼즐 조각 그리기 유틸리티 (단순한 원형 탭)
export function drawPuzzleShape(ctx, x, y, size, edges) {
  const tabRadius = size * 0.15; // 탭의 반지름

  ctx.beginPath();

  // 상단 변
  ctx.moveTo(x, y);
  if (edges.top === 0) {
    ctx.lineTo(x + size, y);
  } else {
    const mid = x + size / 2;
    ctx.lineTo(mid - tabRadius, y);
    if (edges.top > 0) {
      // 볼록 (탭이 위로 나옴)
      ctx.arc(mid, y, tabRadius, Math.PI, 0, false);
    } else {
      // 오목 (홈이 안으로 들어감)
      ctx.arc(mid, y, tabRadius, Math.PI, 0, true);
    }
    ctx.lineTo(x + size, y);
  }

  // 우측 변
  if (edges.right === 0) {
    ctx.lineTo(x + size, y + size);
  } else {
    const mid = y + size / 2;
    ctx.lineTo(x + size, mid - tabRadius);
    if (edges.right > 0) {
      ctx.arc(x + size, mid, tabRadius, -Math.PI / 2, Math.PI / 2, false);
    } else {
      ctx.arc(x + size, mid, tabRadius, -Math.PI / 2, Math.PI / 2, true);
    }
    ctx.lineTo(x + size, y + size);
  }

  // 하단 변
  if (edges.bottom === 0) {
    ctx.lineTo(x, y + size);
  } else {
    const mid = x + size / 2;
    ctx.lineTo(mid + tabRadius, y + size);
    if (edges.bottom > 0) {
      ctx.arc(mid, y + size, tabRadius, 0, Math.PI, false);
    } else {
      ctx.arc(mid, y + size, tabRadius, 0, Math.PI, true);
    }
    ctx.lineTo(x, y + size);
  }

  // 좌측 변
  if (edges.left === 0) {
    ctx.lineTo(x, y);
  } else {
    const mid = y + size / 2;
    ctx.lineTo(x, mid + tabRadius);
    if (edges.left > 0) {
      ctx.arc(x, mid, tabRadius, Math.PI / 2, -Math.PI / 2, false);
    } else {
      ctx.arc(x, mid, tabRadius, Math.PI / 2, -Math.PI / 2, true);
    }
    ctx.lineTo(x, y);
  }

  ctx.closePath();
}

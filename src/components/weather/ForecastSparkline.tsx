import React from 'react';

type Props =
  | {
      values: number[];
      width: number;
      height?: number;
      stroke?: string;
      fill?: string;
      strokeWidth?: number;
      xPositions?: number[];
    }
  | {
    values: number[];
    width?: number;
    height?: number;
    stroke?: string;
    fill?: string;
    strokeWidth?: number;
    xPositions?: number[];
  };

const ForecastSparkline: React.FC<Props> = ({
  values,
  width = 240,
  height = 60,
  stroke = '#60a5fa',
  fill = 'transparent',
  strokeWidth = 2,
  xPositions,
}) => {
  if (!values || values.length === 0) return null;

  // Guard against zero/NaN width => use fallback so SVG isn't blank
  const effectiveWidth = Number.isFinite(width) && width > 0 ? width : Math.max(240, values.length * 56);

  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = Math.max(1e-6, max - min);
  const yFor = (v: number) => height - ((v - min) / range) * height;

  const xs: number[] =
    xPositions && xPositions.length === values.length
      ? xPositions
      : Array.from({ length: values.length }, (_, i) =>
          values.length === 1 ? effectiveWidth / 2 : (i * effectiveWidth) / (values.length - 1)
        );

  const points = values.map((v, i) => `${xs[i]},${yFor(v)}`);
  const d = `M ${points.join(' L ')}`;

  return (
    <svg width="100%" height={height} viewBox={`0 0 ${effectiveWidth} ${height}`} role="img" aria-label="hourly-trend">
      <path d={d} fill={fill} stroke={stroke} strokeWidth={strokeWidth} />
    </svg>
  );
};

export default ForecastSparkline;
export interface IconProps {
    width: number;
    height: number;
    color: string;
}

export default function Icon({
    width,
    height,
    color
}: Readonly<IconProps>) {
  return (
    <div style={{ 
      backgroundColor: color,
      width: `${width}px`, 
      height: `${height}px`,
      display: 'inline-block',
    }} />
  )
}

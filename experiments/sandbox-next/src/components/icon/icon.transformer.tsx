import { IconProps } from ".";

export interface IconPropsFromDataSource {
    size: number;
    color: string;
}

export default function transformer({
    size,
    color
}: Readonly<IconPropsFromDataSource>): IconProps {
    return {
        width: size,
        height: size,
        color: color
    }
}
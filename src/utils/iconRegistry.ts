export type McIconType = 'normal' | 'key' | 'x';

export interface McIconDefinition {
    name: string;
    type: McIconType;
    svg: string;
    colorable: boolean;
}

const normalIcons = import.meta.glob('../assets/icons/normal/*.svg', {
    query: '?raw',
    import: 'default',
    eager: true,
}) as Record<string, string>;

const keyIcons = import.meta.glob('../assets/icons/key/*.svg', {
    query: '?raw',
    import: 'default',
    eager: true,
}) as Record<string, string>;

const xIcons = import.meta.glob('../assets/icons/x/*.svg', {
    query: '?raw',
    import: 'default',
    eager: true,
}) as Record<string, string>;

function fileBase(path: string): string {
    const file = path.split('/').pop() ?? path;
    return file.replace(/\.svg$/i, '');
}

function keyIconName(path: string): string {
    const base = fileBase(path);
    return base.startsWith('key-') ? `mc-${base}` : `mc-key-${base}`;
}

function normalizeNormalIcon(svg: string): string {
    return svg
        .replace(/fill\s*=\s*"#(?:fff|ffffff)"/gi, 'fill="currentColor"')
        .replace(/fill\s*=\s*'#(?:fff|ffffff)'/gi, "fill='currentColor'")
        .replace(/fill\s*:\s*#(?:fff|ffffff)/gi, 'fill:currentColor');
}

function sanitizeSvg(svg: string): string {
    return svg
        .replace(/<script[\s\S]*?<\/script>/gi, '')
        .replace(/\s+on[a-z]+\s*=\s*"[^"]*"/gi, '')
        .replace(/\s+on[a-z]+\s*=\s*'[^']*'/gi, '');
}

function addIcons(
    target: Map<string, McIconDefinition>,
    files: Record<string, string>,
    type: McIconType,
    getName: (path: string) => string,
): void {
    for (const [path, rawSvg] of Object.entries(files)) {
        const name = getName(path);
        const colorable = type === 'normal';
        const svg = sanitizeSvg(colorable ? normalizeNormalIcon(rawSvg) : rawSvg);
        target.set(name, { name, type, svg, colorable });
    }
}

const iconRegistry = new Map<string, McIconDefinition>();

addIcons(iconRegistry, normalIcons, 'normal', (path) => `mc-${fileBase(path)}`);
addIcons(iconRegistry, keyIcons, 'key', keyIconName);
addIcons(iconRegistry, xIcons, 'x', (path) => `mc-x-${fileBase(path)}`);

export type McIconName = string;

export const mcIconNames = Array.from(iconRegistry.keys()).sort();
export const mcNormalIconNames = mcIconNames.filter((name) => iconRegistry.get(name)?.type === 'normal');
export const mcKeyIconNames = mcIconNames.filter((name) => iconRegistry.get(name)?.type === 'key');
export const mcXIconNames = mcIconNames.filter((name) => iconRegistry.get(name)?.type === 'x');

export function getMcIcon(name: string | undefined | null): McIconDefinition | undefined {
    if (!name) return undefined;
    return iconRegistry.get(name.trim());
}

export function hasMcIcon(name: string | undefined | null): boolean {
    return Boolean(getMcIcon(name));
}

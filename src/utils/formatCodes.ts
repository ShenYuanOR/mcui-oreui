export type McFormatCodeTokenType = 'text' | 'color' | 'format' | 'reset' | 'unknown';

export type McFormatCodeEdition = 'java' | 'bedrock';

export interface McFormatCodeToken {
    type: McFormatCodeTokenType;
    code?: string;
    value: string;
}

export interface McFormattingState {
    color?: string;
    bold: boolean;
    italic: boolean;
    underline: boolean;
    strikethrough: boolean;
    obfuscated: boolean;
}

export interface McFormattedTextSegment extends McFormattingState {
    text: string;
}

export interface McFormatCodeColor {
    code: string;
    name: string;
    label: string;
    foreground: string;
    background: string;
    bedrockOnly?: boolean;
    upcomingBedrock?: boolean;
    formatConflict?: boolean;
}

export interface McFormatCodeStyle {
    code: string;
    name: string;
    label: string;
    bedrock: boolean;
    java: boolean;
}

export const MC_FORMAT_CODE_COLORS: Record<string, McFormatCodeColor> = {
    '0': { code: '§0', name: 'black', label: '黑色', foreground: '#000000', background: '#000000' },
    '1': { code: '§1', name: 'dark_blue', label: '深蓝色', foreground: '#0000AA', background: '#00002A' },
    '2': { code: '§2', name: 'dark_green', label: '深绿色', foreground: '#00AA00', background: '#002A00' },
    '3': { code: '§3', name: 'dark_aqua', label: '暗水蓝色', foreground: '#00AAAA', background: '#002A2A' },
    '4': { code: '§4', name: 'dark_red', label: '深红色', foreground: '#AA0000', background: '#2A0000' },
    '5': { code: '§5', name: 'dark_purple', label: '深紫色', foreground: '#AA00AA', background: '#2A002A' },
    '6': { code: '§6', name: 'gold', label: '金色', foreground: '#FFAA00', background: '#402A00' },
    '7': { code: '§7', name: 'gray', label: '灰色', foreground: '#AAAAAA', background: '#2A2A2A' },
    '8': { code: '§8', name: 'dark_gray', label: '深灰色', foreground: '#555555', background: '#151515' },
    '9': { code: '§9', name: 'blue', label: '蓝色', foreground: '#5555FF', background: '#15153F' },
    a: { code: '§a', name: 'green', label: '绿色', foreground: '#55FF55', background: '#153F15' },
    b: { code: '§b', name: 'aqua', label: '水蓝色', foreground: '#55FFFF', background: '#153F3F' },
    c: { code: '§c', name: 'red', label: '红色', foreground: '#FF5555', background: '#3F1515' },
    d: { code: '§d', name: 'light_purple', label: '淡紫色', foreground: '#FF55FF', background: '#3F153F' },
    e: { code: '§e', name: 'yellow', label: '黄色', foreground: '#FFFF55', background: '#3F3F15' },
    f: { code: '§f', name: 'white', label: '白色', foreground: '#FFFFFF', background: '#3F3F3F' },
    g: { code: '§g', name: 'minecoin_gold', label: 'Minecoin 金色', foreground: '#DDD605', background: '#373501', bedrockOnly: true },
    h: { code: '§h', name: 'material_quartz', label: '石英色', foreground: '#E3D4D1', background: '#383534', bedrockOnly: true },
    i: { code: '§i', name: 'material_iron', label: '铁锭色', foreground: '#CECACA', background: '#333232', bedrockOnly: true },
    j: { code: '§j', name: 'material_netherite', label: '下界合金色', foreground: '#443A3B', background: '#110E0E', bedrockOnly: true },
    m: { code: '§m', name: 'material_redstone', label: '红石色 / Java 删除线', foreground: '#971607', background: '#250501', bedrockOnly: true, formatConflict: true },
    n: { code: '§n', name: 'material_copper', label: '铜锭色 / Java 下划线', foreground: '#B4684D', background: '#2D1A13', bedrockOnly: true, formatConflict: true },
    p: { code: '§p', name: 'material_gold', label: '金锭色', foreground: '#DEB12D', background: '#372C0B', bedrockOnly: true },
    q: { code: '§q', name: 'material_emerald', label: '绿宝石色', foreground: '#47A036', background: '#04280D', bedrockOnly: true },
    s: { code: '§s', name: 'material_diamond', label: '钻石色', foreground: '#2CBAA8', background: '#0B2E2A', bedrockOnly: true },
    t: { code: '§t', name: 'material_lapis', label: '青金石色', foreground: '#21497B', background: '#08121E', bedrockOnly: true },
    u: { code: '§u', name: 'material_amethyst', label: '紫水晶色', foreground: '#9A5CC6', background: '#261731', bedrockOnly: true },
    v: { code: '§v', name: 'material_resin', label: '树脂色', foreground: '#EB7114', background: '#3B1D05', bedrockOnly: true },
    w: { code: '§w', name: 'party_blue_color', label: '组队蓝色', foreground: '#8CB3FF', background: '#232D40', bedrockOnly: true, upcomingBedrock: true },
};

export const MC_FORMAT_CODE_STYLES: Record<string, McFormatCodeStyle> = {
    k: { code: '§k', name: 'obfuscated', label: '混淆/随机', bedrock: true, java: true },
    l: { code: '§l', name: 'bold', label: '粗体', bedrock: true, java: true },
    o: { code: '§o', name: 'italic', label: '斜体', bedrock: true, java: true },
    m: { code: '§m', name: 'strikethrough', label: '删除线', bedrock: false, java: true },
    n: { code: '§n', name: 'underlined', label: '下划线', bedrock: false, java: true },
    r: { code: '§r', name: 'reset', label: '重置', bedrock: true, java: true },
};

export const createMcFormattingState = (): McFormattingState => ({
    color: undefined,
    bold: false,
    italic: false,
    underline: false,
    strikethrough: false,
    obfuscated: false,
});

export function parseMcFormatCodes(input: string, edition: McFormatCodeEdition = 'java'): McFormatCodeToken[] {
    const tokens: McFormatCodeToken[] = [];
    let buffer = '';

    const pushText = () => {
        if (buffer) {
            tokens.push({ type: 'text', value: buffer });
            buffer = '';
        }
    };

    for (let index = 0; index < input.length; index += 1) {
        const char = input[index];
        if (char !== '§' || index === input.length - 1) {
            buffer += char;
            continue;
        }

        const rawCode = input[index + 1];
        const code = rawCode.toLowerCase();
        pushText();

        if (code === 'r') {
            tokens.push({ type: 'reset', code, value: `§${rawCode}` });
        } else if (edition === 'java' && MC_FORMAT_CODE_STYLES[code]) {
            tokens.push({ type: 'format', code, value: `§${rawCode}` });
        } else if (MC_FORMAT_CODE_COLORS[code]) {
            tokens.push({ type: 'color', code, value: `§${rawCode}` });
        } else if (MC_FORMAT_CODE_STYLES[code]) {
            tokens.push({ type: 'format', code, value: `§${rawCode}` });
        } else {
            tokens.push({ type: 'unknown', code, value: `§${rawCode}` });
        }

        index += 1;
    }

    pushText();
    return tokens;
}

export function renderMcFormatCodes(input: string, edition: McFormatCodeEdition = 'java'): McFormattedTextSegment[] {
    const tokens = parseMcFormatCodes(input, edition);
    let state = createMcFormattingState();
    const segments: McFormattedTextSegment[] = [];

    for (const token of tokens) {
        if (token.type === 'text') {
            segments.push({ ...state, text: token.value });
            continue;
        }

        if (token.type === 'reset') {
            state = createMcFormattingState();
            continue;
        }

        if (token.type === 'color' && token.code) {
            state.color = MC_FORMAT_CODE_COLORS[token.code]?.foreground;
            continue;
        }

        if (token.type === 'format') {
            switch (token.code) {
                case 'k':
                    state.obfuscated = true;
                    break;
                case 'l':
                    state.bold = true;
                    break;
                case 'o':
                    state.italic = true;
                    break;
                case 'm':
                    state.strikethrough = true;
                    break;
                case 'n':
                    state.underline = true;
                    break;
            }
        }
    }

    return segments;
}

export function stripMcFormatCodes(input: string): string {
    return input.replace(/§./g, '');
}

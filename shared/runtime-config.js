const DEFAULT_API_BACKENDS = [
  {
    name: '本站后端服务器（订阅内容会发送至此）',
    url: 'https://api.ozero.top',
  },
  {
    name: 'asailor官方公共服务（订阅内容会发送至此）',
    url: 'https://api.asailor.org',
  },
  {
    name: '备用公共服务（订阅内容会发送至此）',
    url: 'http://api.wcc.best/',
  },
];

const DEFAULT_REMOTE_CONFIG_OPTIONS = [
  {
    value: 'https://raw.githubusercontent.com/Ozero-top/OpenClash-Config/refs/heads/main/Clash/config/Full-Featured-Optimization.ini',
    text: 'Full-Featured-Optimization （全功能优化版）',
  },
  {
    value: 'https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/config/ACL4SSR_Online.ini',
    text: 'ACL4SSR Online',
  },
  {
    value: 'https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/config/ACL4SSR_Online_Full.ini',
    text: 'ACL4SSR Online Full',
  },
  {
    value: 'https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/config/ACL4SSR_Online_Full_AdblockPlus.ini',
    text: '默认（自动测速）',
  },
  {
    value: 'https://raw.githubusercontent.com/youshandefeiyang/webcdn/main/SONY.ini',
    text: '默认（索尼电视专用）',
  },
  {
    value: 'https://gist.githubusercontent.com/tindy2013/1fa08640a9088ac8652dbd40c5d2715b/raw/default_with_clash_adg.yml',
    text: '默认（附带用于 Clash 的 AdGuard DNS）',
  },
  {
    value: 'https://raw.githubusercontent.com/WC-Dream/ACL4SSR/WD/Clash/config/ACL4SSR_Online_Full_Dream.ini',
    text: 'ACL_全分组 Dream修改版',
  },
  {
    value: 'https://raw.githubusercontent.com/WC-Dream/ACL4SSR/WD/Clash/config/ACL4SSR_Mini_Dream.ini',
    text: 'ACL_精简分组 Dream修改版',
  },
  {
    value: 'https://raw.githubusercontent.com/justdoiting/ClashRule/main/GeneralClashRule.ini',
    text: 'emby-TikTok-流媒体分组-去广告加强版',
  },
  {
    value: 'https://raw.githubusercontent.com/cutethotw/ClashRule/main/GeneralClashRule.ini',
    text: '流媒体通用分组',
  },
  {
    value: 'https://raw.githubusercontent.com/cmliu/ACL4SSR/main/Clash/config/ACL4SSR_Online.ini',
    text: 'Online 默认版 识别港美地区(与Github同步)',
  },
  {
    value: 'https://raw.githubusercontent.com/cmliu/ACL4SSR/main/Clash/config/ACL4SSR_Online_MultiCountry.ini',
    text: 'Online_MultiCountry 识别港美地区 负载均衡(与Github同步)',
  },
  {
    value: 'https://raw.githubusercontent.com/cmliu/ACL4SSR/main/Clash/config/ACL4SSR_Online_MultiCountry_CF.ini',
    text: 'Online_MultiCountry_CF 识别港美地区、CloudFlareCDN 负载均衡 Worker节点专用(与Github同步)',
  },
  {
    value: 'https://raw.githubusercontent.com/cmliu/ACL4SSR/main/Clash/config/ACL4SSR_Online_Full.ini',
    text: 'Online_Full 识别多地区分组(与Github同步)',
  },
  {
    value: 'https://raw.githubusercontent.com/cmliu/ACL4SSR/main/Clash/config/ACL4SSR_Online_Full_CF.ini',
    text: 'Online_Full_CF 识别多地区、CloudFlareCDN 分组 Worker节点专用(与Github同步)',
  },
  {
    value: 'https://raw.githubusercontent.com/cmliu/ACL4SSR/main/Clash/config/ACL4SSR_Online_Full_MultiMode.ini',
    text: 'Online_Full_MultiMode 识别多地区 负载均衡(与Github同步)',
  },
  {
    value: 'https://raw.githubusercontent.com/cmliu/ACL4SSR/main/Clash/config/ACL4SSR_Online_Full_MultiMode_CF.ini',
    text: 'Online_Full_MultiMode_CF 识别多地区、CloudFlareCDN 负载均衡 Worker节点专用(与Github同步)',
  },
  
];

const DEFAULT_MENU_ITEMS = [
  { title: '首页', link: '/', target: '' },
  {
    title: 'CLASH链式代理在线生成',
    link: 'https://clash.ovitor.asia/',
    target: '_blank',
  },
  {
    title: '泄漏检测',
    link: 'https://leak.ozero.asia/',
    target: '_blank',
  },
  {
    title: '机场推荐',
    link: 'https://sub.ozero.asia/',
    target: '_blank',
  },
];

export const DEFAULT_RUNTIME_CONFIG = Object.freeze({
  siteName: 'Subconverter Web',
  apiBackends: DEFAULT_API_BACKENDS,
  enableShortUrl: false,
  shortUrl: '',
  menuItem: DEFAULT_MENU_ITEMS,
  remoteConfigOptions: DEFAULT_REMOTE_CONFIG_OPTIONS,
});

function normalizeHttpUrl(value, { allowPath = true } = {}) {
  if (typeof value !== 'string' || !value.trim()) {
    return '';
  }

  try {
    const url = new URL(value.trim());
    if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password) {
      return '';
    }
    if (!allowPath && (url.search || url.hash)) {
      return '';
    }
    return url.href;
  } catch {
    return '';
  }
}

function normalizeMenuLink(value) {
  if (typeof value !== 'string') {
    return '';
  }
  const link = value.trim();
  if (link.startsWith('/') && !link.startsWith('//')) {
    return link;
  }
  return normalizeHttpUrl(link);
}

function normalizeApiBackends(value, issues) {
  if (!Array.isArray(value)) {
    issues.push('apiBackends 不是数组，已使用默认后端');
    value = DEFAULT_API_BACKENDS;
  }

  const normalized = value.flatMap((item) => {
    const url = normalizeHttpUrl(item?.url, { allowPath: false });
    if (!url) {
      return [];
    }
    return [{ name: String(item?.name || new URL(url).host).trim(), url: url.replace(/\/+$/, '') }];
  });

  if (normalized.length !== value.length) {
    issues.push('已忽略无效的后端配置');
  }
  return normalized;
}

function normalizeRemoteConfigs(value, issues) {
  if (!Array.isArray(value)) {
    issues.push('remoteConfigOptions 不是数组，已使用默认远程配置');
    value = DEFAULT_REMOTE_CONFIG_OPTIONS;
  }

  const normalized = value.flatMap((item) => {
    const url = normalizeHttpUrl(item?.value);
    if (!url) {
      return [];
    }
    return [{ text: String(item?.text || new URL(url).host).trim(), value: url }];
  });
  if (normalized.length !== value.length) {
    issues.push('已忽略无效的远程配置地址');
  }
  return normalized;
}

function normalizeMenuItems(value, issues) {
  if (!Array.isArray(value)) {
    issues.push('menuItem 不是数组，已使用默认菜单');
    value = DEFAULT_MENU_ITEMS;
  }

  const normalized = value.flatMap((item) => {
    const link = normalizeMenuLink(item?.link);
    const title = String(item?.title || '').trim();
    if (!link || !title) {
      return [];
    }
    return [{ title, link, target: item?.target === '_blank' ? '_blank' : '' }];
  });
  if (normalized.length !== value.length) {
    issues.push('已忽略不安全或不完整的菜单项');
  }
  return normalized;
}

export function normalizeRuntimeConfig(rawConfig, { safeFallback = false } = {}) {
  const issues = [];
  const raw = rawConfig && typeof rawConfig === 'object' ? rawConfig : {};
  if (raw !== rawConfig) {
    issues.push('运行时配置缺失，已进入安全手动模式');
  }

  const defaults = safeFallback
    ? { ...DEFAULT_RUNTIME_CONFIG, apiBackends: [], remoteConfigOptions: [] }
    : DEFAULT_RUNTIME_CONFIG;
  const source = { ...defaults, ...raw };
  const shortUrl = normalizeHttpUrl(source.shortUrl, { allowPath: false }).replace(/\/+$/, '');
  const enableShortUrl = source.enableShortUrl === true && Boolean(shortUrl);

  if (source.enableShortUrl === true && !shortUrl) {
    issues.push('短链接地址无效，短链接功能已关闭');
  }

  return {
    config: {
      siteName:
        String(source.siteName || defaults.siteName)
          .trim()
          .slice(0, 80) || defaults.siteName,
      apiBackends: normalizeApiBackends(source.apiBackends, issues),
      enableShortUrl,
      shortUrl,
      menuItem: normalizeMenuItems(source.menuItem, issues),
      remoteConfigOptions: normalizeRemoteConfigs(source.remoteConfigOptions, issues),
    },
    issues: [...new Set(issues)],
  };
}

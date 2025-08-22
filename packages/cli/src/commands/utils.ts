export function getPackageManager(): string {
  const userAgent = process.env.npm_config_user_agent || '';
  const execPath = process.env.npm_execpath || '';

  // 首先检查用户代理
  if (userAgent.includes('yarn')) {
    return 'yarn';
  }
  if (userAgent.includes('pnpm')) {
    return 'pnpm';
  }
  if (userAgent.includes('npm')) {
    return 'npm';
  }

  // 回退到execpath检查
  if (execPath.includes('yarn')) {
    return 'yarn';
  }
  if (execPath.includes('pnpm')) {
    return 'pnpm';
  }
  if (execPath.includes('npm')) {
    return 'npm';
  }

  return 'npm'; // Default fallback
}

export function getPackageManagerInstallCommand(pm: string): string {
  switch (pm) {
    case 'npm':
      return 'install';
    case 'yarn':
      return 'add';
    case 'pnpm':
      return 'add';
    default:
      return 'install';
  }
}

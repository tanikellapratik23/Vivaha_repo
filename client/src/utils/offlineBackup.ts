export type BackupShape = {
  meta: { createdAt: string };
  user?: any;
  onboardingCompleted?: string | boolean;
  guests?: any;
  todos?: any;
  budget?: any;
  favoriteVendors?: any;
  ceremonies?: any;
  playlists?: any;
  seatingCharts?: any;
};

export function collectBackup(): BackupShape {
  return {
    meta: { createdAt: new Date().toISOString() },
    user: JSON.parse(localStorage.getItem('user') || 'null'),
    onboardingCompleted: localStorage.getItem('onboardingCompleted'),
    guests: JSON.parse(localStorage.getItem('guests') || 'null'),
    todos: JSON.parse(localStorage.getItem('todos') || 'null'),
    budget: JSON.parse(localStorage.getItem('budget') || 'null'),
    favoriteVendors: JSON.parse(localStorage.getItem('favoriteVendors') || 'null'),
    ceremonies: JSON.parse(localStorage.getItem('ceremonies') || 'null'),
    playlists: JSON.parse(localStorage.getItem('playlists') || 'null'),
    seatingCharts: JSON.parse(localStorage.getItem('seatingCharts') || 'null'),
  };
}

export function downloadBackupFile(filename = 'wedwise-backup.json') {
  const data = collectBackup();
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export async function importBackupFile(file: File) {
  const text = await file.text();
  const data = JSON.parse(text) as BackupShape;
  if (data.user) localStorage.setItem('user', JSON.stringify(data.user));
  if (typeof data.onboardingCompleted !== 'undefined') localStorage.setItem('onboardingCompleted', String(data.onboardingCompleted));
  if (data.guests) localStorage.setItem('guests', JSON.stringify(data.guests));
  if (data.todos) localStorage.setItem('todos', JSON.stringify(data.todos));
  if (data.budget) localStorage.setItem('budget', JSON.stringify(data.budget));
  if (data.favoriteVendors) localStorage.setItem('favoriteVendors', JSON.stringify(data.favoriteVendors));
  if (data.ceremonies) localStorage.setItem('ceremonies', JSON.stringify(data.ceremonies));
  if (data.playlists) localStorage.setItem('playlists', JSON.stringify(data.playlists));
  if (data.seatingCharts) localStorage.setItem('seatingCharts', JSON.stringify(data.seatingCharts));
}

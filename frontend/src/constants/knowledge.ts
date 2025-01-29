const GB = 1000000000 * 24;

const FILES = [
  'sales data-2023-2024.xlsx',
  'sales data-2022.xlsx',
  'sales data-2021.xlsx',
  'sales data-2020.xlsx',
  'product info.txt',
];

const URLS = [
  'https://www.cloud.com/s/c218bo6kjuqyv66/design_suriname_2015.mp3',
  'https://www.cloud.com/s/c218bo6kjuqyv66/expertise_2015_conakry_sao-tome-and-principe_gender.mp4',
  'https://www.cloud.com/s/c218bo6kjuqyv66/money-popup-crack.pdf',
  'https://www.cloud.com/s/c218bo6kjuqyv66/large_news.txt',
  'https://www.cloud.com/s/c218bo6kjuqyv66/nauru-6015-small-fighter-left-gender.psd',
  'https://www.cloud.com/s/c218bo6kjuqyv66/tv-xs.doc',
  'https://www.cloud.com/s/c218bo6kjuqyv66/gustavia-entertainment-productivity.docx',
  'https://www.cloud.com/s/c218bo6kjuqyv66/vintage_bahrain_saipan.xls',
  'https://www.cloud.com/s/c218bo6kjuqyv66/indonesia-quito-nancy-grace-left-glad.xlsx',
  'https://www.cloud.com/s/c218bo6kjuqyv66/legislation-grain.zip',
  'https://www.cloud.com/s/c218bo6kjuqyv66/large_energy_dry_philippines.rar',
  'https://www.cloud.com/s/c218bo6kjuqyv66/footer-243-ecuador.iso',
  'https://www.cloud.com/s/c218bo6kjuqyv66/kyrgyzstan-04795009-picabo-street-guide-style.ai',
  'https://www.cloud.com/s/c218bo6kjuqyv66/india-data-large-gk-chesterton-mother.esp',
  'https://www.cloud.com/s/c218bo6kjuqyv66/footer-barbados-celine-dion.ppt',
  'https://www.cloud.com/s/c218bo6kjuqyv66/socio_respectively_366996.pptx',
  'https://www.cloud.com/s/c218bo6kjuqyv66/socio_ahead_531437_sweden_popup.wav',
  'https://www.cloud.com/s/c218bo6kjuqyv66/trinidad_samuel-morse_bring.m4v',
  'https://www.cloud.com/s/c218bo6kjuqyv66/xl_david-blaine_component_tanzania_books.pdf',
];

const SHARED_PERSONS = [...Array(20)].map((_, index) => ({
  id: index,
  name: 'x',
  email: 'xxx@x.com',
  avatarUrl: '',
  permission: 'view',
}));

export const FILE_TYPE_OPTIONS = [
  'folder',
  'txt',
  'zip',
  'audio',
  'image',
  'video',
  'word',
  'excel',
  'powerpoint',
  'pdf',
  'photoshop',
  'illustrator',
];

export const STATUS_OPTIONS = [
  'Uploading...',
  'Uploaded',
  'Preparing...',
  'Indexing...',
  'Indexed',
  'Failed',
];

// ----------------------------------------------------------------------

const shared = (index: number) =>
  (index === 0 && SHARED_PERSONS.slice(0, 5)) ||
  (index === 1 && SHARED_PERSONS.slice(5, 9)) ||
  (index === 2 && SHARED_PERSONS.slice(9, 11)) ||
  (index === 3 && SHARED_PERSONS.slice(11, 12)) ||
  [];

export const _files = FILES.map((name, index) => ({
  id: `${index}_file`,
  name,
  url: URLS[index],
  shared: shared(index),
  tags: [],
  size: GB / ((index + 1) * 500),
  createdAt: new Date(),
  modifiedAt: new Date(),
  type: `pdf`,
  isFavorited: true,
}));

export const _allFiles = [..._files];

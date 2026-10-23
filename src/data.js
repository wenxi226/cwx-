import { materialProjects } from './materialProjects';

// 将个人信息、技能文案、经历与作品集中在这里，后续替换素材时无需修改布局。
export const profile = {
  name: '陈文希',
  englishName: 'WEN XI CHEN',
  email: '3158991946@qq.com',
  wechat: '16620187134',
  intro: '我是陈文希，一名用镜头探索潮玩世界的视觉创作者。喜欢有性格的玩具，也喜欢让静止的角色，拥有自己的故事。',
  description: '从灯光、构图到后期，从一张照片到一套完整的视觉表达，我希望把想象力变成看得见的作品。让每一次创作，都多一点好奇、多一点趣味。',
  experiences: [
    { stage: '01', title: '潮玩摄影 / 视觉创作', detail: '工作经历待补充 · 后续填写公司、职位和任职时间' },
    { stage: '02', title: '品牌项目 / 设计合作', detail: '项目经历待补充 · 后续填写合作品牌和创作职责' },
  ],
};

export const skills = [
  { id: 'camera', code: '01', title: '相机摄影', english: 'PHOTOGRAPHY', symbol: 'camera', description: '把小小的玩具，拍出大大的情绪。用灯光、构图和场景，唤醒角色的生命力。', tags: ['棚拍布光', '场景搭建', '视觉叙事'] },
  { id: 'ps', code: '02', title: 'Photoshop', english: 'IMAGE & COMPOSITE', symbol: 'Ps', description: '从质感修饰到创意合成，让照片里的每一个细节，都成为故事的一部分。', tags: ['精细修图', '创意合成', '色彩控制'] },
  { id: 'ai', code: '03', title: 'Illustrator', english: 'VECTOR & PACKAGING', symbol: 'Ai', description: '用线条建立视觉秩序，把角色的个性延伸到插画、图形与包装设计。', tags: ['矢量插画', '包装设计', '视觉系统'] },
  { id: 'nano', code: '04', title: 'Nano Banana', english: 'AI VISUAL EXPLORATION', symbol: '✳', description: '让脑海里的画面快速显影。探索场景、风格与创意方向，为创作打开新可能。', tags: ['场景探索', '图像生成', '创意迭代'] },
  { id: 'gpt', code: '05', title: 'ChatGPT', english: 'IDEAS & STORYTELLING', symbol: 'gpt', description: '从一个闪念到完整的创意脚本，把灵感梳理成有逻辑、有温度的视觉故事。', tags: ['创意策划', '脚本构思', '工作流辅助'] },
];

export const categories = [
  { id: 'images', label: '图片摄影', en: 'PHOTOGRAPHY' },
  { id: 'packaging', label: '包装插画', en: 'PACKAGING' },
  { id: 'ip', label: 'IP 设计', en: 'IP DESIGN' },
  { id: 'video', label: '视频影像', en: 'MOTION' },
];

const publicBase = import.meta.env.BASE_URL === '/cwx-/' ? `${import.meta.env.BASE_URL}public/` : import.meta.env.BASE_URL;
const withBase = value => value?.startsWith('/') ? `${publicBase}${value.slice(1)}` : value;

export const projects = materialProjects.map(project => ({
  ...project,
  image: withBase(project.image),
  images: project.images?.map(withBase),
  originalImages: project.originalImages?.map(withBase),
  video: withBase(project.video),
  poster: withBase(project.poster),
}));

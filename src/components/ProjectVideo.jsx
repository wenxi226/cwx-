import { useEffect, useRef, useState } from 'react';
import './ProjectVideo.css';

export default function ProjectVideo({ project }) {
  const videoRef = useRef(null);
  const [state, setState] = useState('loading');

  useEffect(() => {
    const video = videoRef.current;
    // Restore the source after StrictMode's development cleanup/setup cycle.
    video.querySelector('source').setAttribute('src', project.video);
    video.load();
    const pauseWhenHidden = () => { if (document.hidden) video.pause(); };
    document.addEventListener('visibilitychange', pauseWhenHidden);
    return () => {
      document.removeEventListener('visibilitychange', pauseWhenHidden);
      video.pause();
      // Release the decoder and cancel buffered/network work when the dialog closes.
      video.querySelector('source')?.removeAttribute('src');
      video.removeAttribute('src');
      video.load();
    };
  }, [project.video]);

  function retry() {
    setState('loading');
    videoRef.current.load();
  }

  return <div className="project-video">
    <video ref={videoRef} className="dialog-video" controls playsInline preload="metadata"
      poster={project.poster} width={project.videoWidth} height={project.videoHeight}
      aria-label={`${project.title}，有声视频作品`}
      onLoadStart={() => setState('loading')}
      onLoadedMetadata={() => setState('ready')}
      onCanPlay={() => setState('ready')}
      onPlaying={() => setState('ready')}
      onWaiting={() => { if (!videoRef.current?.paused) setState('buffering'); }}
      onError={() => setState('error')}>
      <source src={project.video} type="video/mp4" onError={() => setState('error')} />
      你的浏览器暂不支持此视频，请使用下方链接打开。
    </video>
    {(state === 'loading' || state === 'buffering') && <span className="project-video-status" role="status">{state === 'buffering' ? '正在缓冲…' : '正在加载视频…'}</span>}
    {state === 'error' && <div className="project-video-error" role="alert"><p>视频暂时未能加载，请检查网络后重试。</p><button type="button" onClick={retry}>重新加载</button><a href={project.video} target="_blank" rel="noreferrer">直接打开视频 ↗</a></div>}
  </div>;
}

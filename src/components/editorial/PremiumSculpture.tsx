"use client";

import { useEffect, useRef } from "react";

/** Lazy WebGL detail. Artwork remains visible when motion or WebGL is unavailable. */
export function PremiumSculpture() {
  const host = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const node = host.current;
    if (!node) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const desktop = window.matchMedia("(min-width: 768px)");
    let disposed = false;
    let cleanup = () => {};
    let started = false;
    const observer = new IntersectionObserver(async ([entry]) => {
      if (!entry.isIntersecting || started || motion.matches || !desktop.matches) return;
      started = true;
      const THREE = await import("three");
      if (disposed) return;
      let renderer;
      try { renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true }); }
      catch { return; }
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(40, 1, .1, 20);
      camera.position.z = 5;
      const geometry = new THREE.TorusKnotGeometry(1, .23, 160, 24);
      const material = new THREE.MeshStandardMaterial({ color: 0xc5aa80, metalness: .7, roughness: .28 });
      const sculpture = new THREE.Mesh(geometry, material);
      scene.add(sculpture, new THREE.HemisphereLight(0xfff2dd, 0x181818, 3));
      const key = new THREE.DirectionalLight(0xffebcd, 6);
      key.position.set(3, 4, 4); scene.add(key);
      const fill = new THREE.DirectionalLight(0xffffff, 3);
      fill.position.set(-3, -1, 2); scene.add(fill);
      node.appendChild(renderer.domElement);
      const resize = new ResizeObserver(() => {
        const {width, height} = node.getBoundingClientRect();
        if (!width || !height) return;
        renderer.setSize(width, height); camera.aspect = width / height; camera.updateProjectionMatrix();
      });
      resize.observe(node);
      let visible = true;
      let pointer = 0;
      const move = (event: PointerEvent) => { pointer = (event.clientX / window.innerWidth - .5) * .5; };
      window.addEventListener("pointermove", move, { passive: true });
      const visibility = new IntersectionObserver(([item]) => { visible = item.isIntersecting; });
      visibility.observe(node);
      renderer.setAnimationLoop((time) => {
        if (!visible || document.hidden || motion.matches || !desktop.matches) return;
        sculpture.rotation.y = time * .00012 + pointer;
        sculpture.rotation.x = Math.sin(time * .00015) * .12;
        renderer.render(scene, camera);
      });
      cleanup = () => {
        renderer.setAnimationLoop(null); resize.disconnect(); visibility.disconnect();
        window.removeEventListener("pointermove", move);
        geometry.dispose(); material.dispose(); renderer.dispose(); renderer.domElement.remove();
      };
    }, { rootMargin: "150px" });
    observer.observe(node);
    return () => { disposed = true; observer.disconnect(); cleanup(); };
  }, []);
  return <div ref={host} className="premium-sculpture" aria-hidden="true" />;
}

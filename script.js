document.addEventListener('DOMContentLoaded', () => {
  const introScreen = document.getElementById('intro-screen');
  const introText = document.getElementById('intro-text');
  const mainContent = document.getElementById('main-content');

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  // =====================================================
  // BOTTOM DOCK — GOOEY NAVIGATION
  // =====================================================

  const dock = document.getElementById('bottom-dock');
  const dockItems = document.querySelectorAll('.dock-item');
  const goo = document.querySelector('.dock-goo');
  const indicator = document.querySelector('.dock-active-indicator');

  function moveDockIndicator(item) {
  if (!dock || !item || !indicator || !goo) return;

  const dockRect = dock.getBoundingClientRect();
  const itemRect = item.getBoundingClientRect();

  // Position exacte de l'élément dans le Dock
  const itemLeft = itemRect.left - dockRect.left;

  // Centre exact de l'élément
  const itemCenter = itemLeft + (itemRect.width / 2);

  // Petit point lumineux
  indicator.style.left = `${itemCenter}px`;

  // Lumière / Gooey
  goo.style.setProperty('--goo-x', `${itemLeft}px`);
}
  function setActiveDockItem(item) {
    dockItems.forEach(link => {
      link.classList.remove('active');
    });

    item.classList.add('active');

    moveDockIndicator(item);
  }

  /* =========================================================
     CINEMATIC FIREFLY WELCOME
     MELIOR — Final integrated version
     ========================================================= */

  (() => {
      if (document.getElementById('firefly-welcome')) return;

      const intro = document.createElement('div');
      intro.id = 'firefly-welcome';

      Object.assign(intro.style, {
        position: 'fixed',
        inset: '0',
        zIndex: '99999',
        overflow: 'hidden',
        pointerEvents: 'none',
        background: '#062619',
        opacity: '1'
      });

      const canvas = document.createElement('canvas');
      intro.appendChild(canvas);
      document.body.appendChild(intro);

      const ctx = canvas.getContext('2d', {
        alpha: true,
        desynchronized: true
      });

      if (!ctx) {
        intro.remove();
        if (mainContent) mainContent.style.opacity = '1';
        document.body.style.overflow = '';
        return;
      }

      const reducedMotion =
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      const mainContent =
        document.getElementById('main-content');

      const oldIntro =
        document.getElementById('intro-screen');

      document.body.style.overflow = 'hidden';

      if (mainContent) {
        mainContent.style.opacity = '0';
      }

      if (oldIntro) {
        oldIntro.style.display = 'none';
      }

      /* =========================================================
         CONFIGURATION
         ========================================================= */

      const COLORS = {
        background: '#062619',
        darkGreen: '#0A5136',
        green: '#0EAB6A',
        gold: '#D9B57C'
      };

      const DESKTOP_PARTICLES = 700;
      const MOBILE_PARTICLES = 380;

      let width = 0;
      let height = 0;
      let dpr = 1;

      let particleCount =
        window.innerWidth <= 640
          ? MOBILE_PARTICLES
          : DESKTOP_PARTICLES;

      let welcomeTargets = [];
      let portfolioTargets = [];
      let particles = [];

      /* =========================================================
         TIMELINE — ≈ 10.2 SECONDS
         ========================================================= */

      const PHASE_ARRIVAL = 800;
      const PHASE_GUIDE = 1800;

      const PHASE_WELCOME = 3800;
      const PHASE_BREATHE = 4800;

      const PHASE_DISPERSION = 5600;
      const PHASE_FLOAT = 6400;

      const PHASE_MIGRATION = 7800;
      const PHASE_DEPARTURE = 9300;

      const PHASE_FINISH = 10200;

      let startTime = performance.now();
      let animationFrame = null;
      let finished = false;

      /* =========================================================
         HELPERS
         ========================================================= */

      function clamp(value, min, max) {
        return Math.max(
          min,
          Math.min(max, value)
        );
      }

      function lerp(a, b, t) {
        return a + (b - a) * t;
      }

      function easeOutCubic(t) {
        t = clamp(t, 0, 1);
        return 1 - Math.pow(1 - t, 3);
      }

      function easeInCubic(t) {
        t = clamp(t, 0, 1);
        return t * t * t;
      }

      function easeInOutCubic(t) {
        t = clamp(t, 0, 1);

        return t < 0.5
          ? 4 * t * t * t
          : 1 - Math.pow(-2 * t + 2, 3) / 2;
      }

      function easeOutExpo(t) {
        t = clamp(t, 0, 1);

        return t === 1
          ? 1
          : 1 - Math.pow(2, -10 * t);
      }

      /* =========================================================
         RESIZE
         ========================================================= */

      function resize() {
        width = window.innerWidth;
        height = window.innerHeight;

        dpr = Math.min(
          window.devicePixelRatio || 1,
          2
        );

        canvas.width =
          Math.floor(width * dpr);

        canvas.height =
          Math.floor(height * dpr);

        canvas.style.width =
          width + 'px';

        canvas.style.height =
          height + 'px';

        ctx.setTransform(
          dpr,
          0,
          0,
          dpr,
          0,
          0
        );

        const newCount =
          width <= 640
            ? MOBILE_PARTICLES
            : DESKTOP_PARTICLES;

        if (newCount !== particleCount) {
          particleCount = newCount;
          createParticles();
        } else {
          createTextTargets(
            'WELCOME',
            false
          );

          createTextTargets(
            'TO MY PORTFOLIO',
            true
          );

          assignTargets();
        }
      }

      /* =========================================================
         TEXT → PARTICLE TARGETS
         ========================================================= */

      function createTextTargets(
        text,
        isLongText = false
      ) {
        const offscreen =
          document.createElement('canvas');

        const offCtx =
          offscreen.getContext(
            '2d',
            { willReadFrequently: true }
          );

        if (!offCtx) return [];

        const mobile =
          width <= 640;

        const targetWidth =
          isLongText
            ? Math.min(
                width * 0.94,
                1400
              )
            : Math.min(
                width * 0.88,
                1250
              );

        let fontSize =
          isLongText
            ? Math.min(
                width * 0.11,
                120
              )
            : Math.min(
                width * 0.115,
                125
              );

        fontSize =
          Math.max(
            fontSize,
            mobile ? 28 : 42
          );

        offscreen.width =
          Math.ceil(targetWidth);

        offscreen.height =
          Math.ceil(
            isLongText
              ? height * 0.48
              : height * 0.35
          );

        offCtx.clearRect(
          0,
          0,
          offscreen.width,
          offscreen.height
        );

        offCtx.textAlign = 'center';
        offCtx.textBaseline = 'middle';

        offCtx.font =
          `800 ${fontSize}px "Fraunces", serif`;

        /*
          Reduce font size until the text fits.
        */

        while (
          offCtx.measureText(text).width >
            targetWidth &&
          fontSize > 30
        ) {
          fontSize -= 2;

          offCtx.font =
            `800 ${fontSize}px "Fraunces", serif`;
        }

        offCtx.fillStyle = '#ffffff';
        offCtx.strokeStyle = '#ffffff';

        offCtx.lineJoin = 'round';

        offCtx.lineWidth =
          Math.max(
            2,
            Math.floor(fontSize * 0.06)
          );

        /*
          TO MY PORTFOLIO
          Desktop → one line
          Mobile → two balanced lines if necessary
        */

        if (
          isLongText &&
          mobile
        ) {
          const words =
            text.split(' ');

          let bestSplit = 1;
          let bestDiff = Infinity;

          for (
            let i = 1;
            i < words.length;
            i++
          ) {
            const first =
              words
                .slice(0, i)
                .join(' ');

            const second =
              words
                .slice(i)
                .join(' ');

            const firstWidth =
              offCtx.measureText(first).width;

            const secondWidth =
              offCtx.measureText(second).width;

            const diff =
              Math.abs(
                firstWidth -
                secondWidth
              );

            if (diff < bestDiff) {
              bestDiff = diff;
              bestSplit = i;
            }
          }

          const top =
            words
              .slice(0, bestSplit)
              .join(' ');

          const bottom =
            words
              .slice(bestSplit)
              .join(' ');

          const lineHeight =
            fontSize * 1.05;

          offscreen.height =
            Math.ceil(
              lineHeight * 2.8
            );

          offCtx.font =
            `800 ${fontSize}px "Fraunces", serif`;

          const topY =
            offscreen.height / 2 -
            lineHeight * 0.52;

          const bottomY =
            offscreen.height / 2 +
            lineHeight * 0.52;

          offCtx.strokeText(
            top,
            offscreen.width / 2,
            topY
          );

          offCtx.fillText(
            top,
            offscreen.width / 2,
            topY
          );

          offCtx.strokeText(
            bottom,
            offscreen.width / 2,
            bottomY
          );

          offCtx.fillText(
            bottom,
            offscreen.width / 2,
            bottomY
          );
        } else {
          offCtx.strokeText(
            text,
            offscreen.width / 2,
            offscreen.height / 2
          );

          offCtx.fillText(
            text,
            offscreen.width / 2,
            offscreen.height / 2
          );
        }

        const imageData =
          offCtx.getImageData(
            0,
            0,
            offscreen.width,
            offscreen.height
          );

        const pixels =
          imageData.data;

        const points = [];

        const gap =
          mobile ? 2 : 3;

        for (
          let y = 0;
          y < offscreen.height;
          y += gap
        ) {
          for (
            let x = 0;
            x < offscreen.width;
            x += gap
          ) {
            const index =
              (y * offscreen.width + x) *
              4;

            if (
              pixels[index + 3] > 100
            ) {
              points.push({
                x,
                y
              });
            }
          }
        }

        if (!points.length) {
          return [];
        }

        /*
          Keep target density under control.
        */

        if (
          points.length > particleCount
        ) {
          const area =
            offscreen.width *
            offscreen.height;

          const cellSize =
            Math.max(
              3,
              Math.sqrt(
                area / particleCount
              ) * 0.82
            );

          const cols =
            Math.max(
              1,
              Math.floor(
                offscreen.width /
                cellSize
              )
            );

          const rows =
            Math.max(
              1,
              Math.floor(
                offscreen.height /
                cellSize
              )
            );

          const cells =
            new Array(
              cols * rows
            )
            .fill(null)
            .map(() => []);

          points.forEach(point => {
            const cx =
              Math.min(
                cols - 1,
                Math.floor(
                  point.x / cellSize
                )
              );

            const cy =
              Math.min(
                rows - 1,
                Math.floor(
                  point.y / cellSize
                )
              );

            cells[
              cy * cols + cx
            ].push(point);
          });

          const reduced = [];

          cells.forEach(cell => {
            if (
              !cell.length ||
              reduced.length >= particleCount
            ) {
              return;
            }

            let sx = 0;
            let sy = 0;

            cell.forEach(point => {
              sx += point.x;
              sy += point.y;
            });

            reduced.push({
              x: sx / cell.length,
              y: sy / cell.length
            });
          });

          points.length = 0;
          points.push(...reduced);
        }

        /*
          Map canvas coordinates to viewport.
        */

        return points.map(point => ({
          x:
            width / 2 -
            offscreen.width / 2 +
            point.x,

          y:
            height / 2 -
            offscreen.height / 2 +
            point.y
        }));
      }

      /* =========================================================
         PARTICLES
         ========================================================= */

      function createParticles() {
        welcomeTargets =
          createTextTargets(
            'WELCOME',
            false
          );

        portfolioTargets =
          createTextTargets(
            'TO MY PORTFOLIO',
            true
          );

        particles = [];

        for (
          let i = 0;
          i < particleCount;
          i++
        ) {
          const welcome =
            welcomeTargets.length
              ? welcomeTargets[
                  Math.floor(
                    i *
                    welcomeTargets.length /
                    particleCount
                  )
                ]
              : {
                  x:
                    Math.random() *
                    width,

                  y:
                    Math.random() *
                    height
                };

          const portfolio =
            portfolioTargets.length
              ? portfolioTargets[
                  Math.floor(
                    i *
                    portfolioTargets.length /
                    particleCount
                  )
                ]
              : {
                  x:
                    Math.random() *
                    width,

                  y:
                    Math.random() *
                    height
                };

          const depth =
            0.35 +
            Math.random() * 0.65;

          const particle = {
            x:
              Math.random() *
              width,

            y:
              Math.random() *
              height,

            startX:
              Math.random() *
              width,

            startY:
              Math.random() *
              height,

            vx:
              (Math.random() - 0.5) *
              0.15,

            vy:
              (Math.random() - 0.5) *
              0.15,

            welcomeX:
              welcome.x,

            welcomeY:
              welcome.y,

            portfolioX:
              portfolio.x,

            portfolioY:
              portfolio.y,

            size:
              (0.65 +
                Math.random() * 1.35) *
              (0.7 + depth * 0.45),

            alpha:
              0.35 +
              Math.random() * 0.55,

            depth,

            delay:
              Math.random() * 1200,

            phase:
              Math.random() *
              Math.PI *
              2,

            driftX:
              Math.random() * 2 - 1,

            driftY:
              Math.random() * 2 - 1,

            noiseSeed:
              Math.random() *
              100000,

            gold:
              Math.random() < 0.10,

            dispersionAngle:
              Math.random() *
              Math.PI *
              2,

            dispersionDistance:
              70 +
              Math.random() * 190,

            dispersionCurve:
              Math.random() * 2 - 1,

            floatOffset:
              Math.random() *
              Math.PI *
              2,

            floatAmplitude:
              3 +
              Math.random() * 14,

            migrationBias:
              Math.random() * 2 - 1,

            trailX: [],
            trailY: [],

            isGuide: false
          };

          particles.push(
            particle
          );
        }

        /*
          One special Guide Firefly.
        */

        if (particles.length) {
          const guideIndex =
            Math.floor(
              Math.random() *
              particles.length
            );

          particles[
            guideIndex
          ].isGuide = true;

          particles[
            guideIndex
          ].gold = true;

          particles[
            guideIndex
          ].size *= 1.9;

          particles[
            guideIndex
          ].alpha = 1;
        }

        assignTargets();
      }

      function assignTargets() {
        particles.forEach(
          (particle, index) => {
            if (welcomeTargets.length) {
              const target =
                welcomeTargets[
                  index %
                  welcomeTargets.length
                ];

              particle.welcomeX =
                target.x;

              particle.welcomeY =
                target.y;
            }

            if (portfolioTargets.length) {
              const target =
                portfolioTargets[
                  index %
                  portfolioTargets.length
                ];

              particle.portfolioX =
                target.x;

              particle.portfolioY =
                target.y;
            }
          }
        );
      }

      /* =========================================================
         TRAILS
         ========================================================= */

      function updateTrail(
        particle
      ) {
        if (
          particle.depth < 0.45
        ) {
          return;
        }

        particle.trailX.unshift(
          particle.x
        );

        particle.trailY.unshift(
          particle.y
        );

        const maxTrail =
          particle.isGuide
            ? 8
            : 4;

        if (
          particle.trailX.length >
          maxTrail
        ) {
          particle.trailX.length =
            maxTrail;

          particle.trailY.length =
            maxTrail;
        }
      }

      function drawTrail(
        particle
      ) {
        if (
          particle.trailX.length <
          2
        ) {
          return;
        }

        ctx.save();

        for (
          let i =
            particle.trailX.length - 1;
          i >= 1;
          i--
        ) {
          const progress =
            1 -
            i /
            particle.trailX.length;

          ctx.globalAlpha =
            particle.alpha *
            progress *
            0.08;

          ctx.beginPath();

          ctx.moveTo(
            particle.trailX[i],
            particle.trailY[i]
          );

          ctx.lineTo(
            particle.trailX[i - 1],
            particle.trailY[i - 1]
          );

          ctx.lineWidth =
            Math.max(
              0.35,
              particle.size * 0.45
            );

          ctx.strokeStyle =
            particle.gold
              ? COLORS.gold
              : COLORS.green;

          ctx.stroke();
        }

        ctx.restore();
      }

      /* =========================================================
         PARTICLE RENDERING
         ========================================================= */

      function drawParticle(
        particle,
        x,
        y,
        alpha,
        time,
        boost = 1
      ) {
        if (alpha <= 0) return;

        const pulse =
          0.82 +
          Math.sin(
            time *
              particle.speed +
              particle.phase
          ) *
          0.14;

        const size =
          particle.size *
          pulse *
          (1 +
            (boost - 1) *
            0.16);

        const color =
          particle.gold
            ? COLORS.gold
            : COLORS.green;

        /*
          Glow.
        */

        ctx.save();

        ctx.globalAlpha =
          clamp(
            alpha *
            0.075 *
            (particle.gold
              ? 1.15
              : 1),
            0,
            0.25
          );

        ctx.beginPath();

        ctx.arc(
          x,
          y,
          size * 2.5,
          0,
          Math.PI * 2
        );

        ctx.fillStyle =
          color;

        ctx.fill();

        /*
          Guide halo.
        */

        if (
          particle.isGuide
        ) {
          ctx.globalAlpha =
            0.075 +
            Math.sin(
              time * 3.5 +
              particle.phase
            ) *
            0.025;

          ctx.beginPath();

          ctx.arc(
            x,
            y,
            size * 6,
            0,
            Math.PI * 2
          );

          ctx.fillStyle =
            COLORS.gold;

          ctx.fill();
        }

        /*
          Core.
        */

        ctx.globalAlpha =
          clamp(
            alpha *
            (1 +
              (boost - 1) *
              0.35),
            0,
            1
          );

        ctx.beginPath();

        ctx.arc(
          x,
          y,
          size,
          0,
          Math.PI * 2
        );

        ctx.fillStyle =
          color;

        ctx.fill();

        ctx.restore();
      }

      /* =========================================================
         ACT I — ARRIVAL
         ========================================================= */

      function updateArrival(
        particle,
        elapsed
      ) {
        const delay =
          particle.delay;

        if (
          elapsed < delay
        ) {
          particle.alpha *=
            0.985;

          return;
        }

        const progress =
          clamp(
            (elapsed - delay) /
            Math.max(
              1,
              PHASE_ARRIVAL -
              delay
            ),
            0,
            1
          );

        const eased =
          easeOutExpo(progress);

        /*
          Particles become visible where they already are.
        */

        particle.x =
          particle.startX +
          Math.sin(
            elapsed * 0.0017 +
            particle.phase
          ) *
          particle.driftX *
          3;

        particle.y =
          particle.startY +
          Math.cos(
            elapsed * 0.0015 +
            particle.phase
          ) *
          particle.driftY *
          3;

        particle.alpha =
          Math.max(
            0.02,
            particle.alpha *
            eased
          );
      }

      /* =========================================================
         ACT II — GUIDE
         ========================================================= */

      function updateGuidePhase(
        particle,
        elapsed
      ) {
        if (!particle.isGuide) {
          /*
            Other particles begin gently
            reacting to the guide.
          */

          const guide =
            particles.find(
              p => p.isGuide
            );

          if (guide) {
            const dx =
              guide.x -
              particle.x;

            const dy =
              guide.y -
              particle.y;

            const distance =
              Math.sqrt(
                dx * dx +
                dy * dy
              );

            if (
              distance > 1 &&
              distance < 260
            ) {
              const influence =
                (1 -
                  distance / 260) *
                0.0005;

              particle.vx +=
                dx *
                influence;

              particle.vy +=
                dy *
                influence;
            }
          }
        }

        const targetX =
          width * 0.5;

        const targetY =
          height * 0.5;

        if (
          particle.isGuide
        ) {
          const dx =
            targetX -
            particle.x;

          const dy =
            targetY -
            particle.y;

          particle.vx +=
            dx *
            0.00065;

          particle.vy +=
            dy *
            0.00065;

          particle.vx *=
            0.94;

          particle.vy *=
            0.94;

          particle.x +=
            particle.vx;

          particle.y +=
            particle.vy;
        } else {
          particle.vx *=
            0.985;

          particle.vy *=
            0.985;

          particle.x +=
            particle.vx;

          particle.y +=
            particle.vy;

          particle.x +=
            Math.sin(
              elapsed * 0.0018 +
              particle.noiseSeed
            ) *
            0.08;

          particle.y +=
            Math.cos(
              elapsed * 0.0015 +
              particle.noiseSeed
            ) *
            0.08;
        }
      }

      /* =========================================================
         ACT III — GATHER → WELCOME
         ========================================================= */

      function updateWelcome(
        particle,
        elapsed
      ) {
        const progress =
          clamp(
            (elapsed -
              PHASE_GUIDE) /
            (PHASE_WELCOME -
              PHASE_GUIDE),
            0,
            1
          );

        const eased =
          easeOutExpo(
            progress
          );

        const dx =
          particle.welcomeX -
          particle.x;

        const dy =
          particle.welcomeY -
          particle.y;

        /*
          Timeline determines the strength.
          Physics determines the motion.
        */

        const attraction =
          lerp(
            0.0007,
            0.0038,
            eased
          );

        particle.vx +=
          dx *
          attraction;

        particle.vy +=
          dy *
          attraction;

        /*
          Small organic noise.
        */

        particle.vx +=
          Math.sin(
            elapsed * 0.002 +
            particle.noiseSeed
          ) *
          0.009 *
          particle.driftX;

        particle.vy +=
          Math.cos(
            elapsed * 0.0018 +
            particle.noiseSeed
          ) *
          0.009 *
          particle.driftY;

        particle.vx *=
          0.90;

        particle.vy *=
          0.90;

        particle.x +=
          particle.vx;

        particle.y +=
          particle.vy;

        /*
          Controlled settling.
        */

        const remaining =
          1 - progress;

        if (
          remaining < 0.12
        ) {
          const settleProgress =
            (0.12 -
              remaining) /
            0.12;

          const settle =
            easeOutCubic(
              settleProgress
            );

          particle.x =
            lerp(
              particle.x,
              particle.welcomeX,
              settle * 0.35
            );

          particle.y =
            lerp(
              particle.y,
              particle.welcomeY,
              settle * 0.35
            );

          particle.vx *=
            0.75;

          particle.vy *=
            0.75;
        }

        /*
          Hard safety snap.
        */

        if (
          elapsed >=
          PHASE_WELCOME
        ) {
          particle.x =
            particle.welcomeX;

          particle.y =
            particle.welcomeY;

          particle.vx = 0;
          particle.vy = 0;
        }
      }

      /* =========================================================
         ACT IV — WELCOME BREATHING
         ========================================================= */

      function updateBreathing(
        particle,
        elapsed
      ) {
        const t =
          elapsed -
          PHASE_WELCOME;

        const breath =
          Math.sin(
            t * 0.0035 +
            particle.phase
          );

        particle.x =
          particle.welcomeX +
          Math.cos(
            particle.phase
          ) *
          breath *
          0.8;

        particle.y =
          particle.welcomeY +
          Math.sin(
            particle.phase
          ) *
          breath *
          0.8;

        particle.alpha =
          particle.isGuide
            ? 1
            : particle.alpha *
              (0.94 +
                breath * 0.035);
      }

      /* =========================================================
         ACT V — ORGANIC DISPERSION
         ========================================================= */

      function updateDispersion(
        particle,
        elapsed
      ) {
        const progress =
          clamp(
            (elapsed -
              PHASE_BREATHE) /
            (PHASE_DISPERSION -
              PHASE_BREATHE),
            0,
            1
          );

        /*
          One continuous organic trajectory.

          0 → 1/3:
          leave WELCOME

          1/3 → 0.72:
          floating / plateau

          0.72 → 1:
          begin changing direction
        */

        let trajectory;

        if (
          progress < 0.333
        ) {
          trajectory =
            easeOutCubic(
              progress /
              0.333
            );
        } else if (
          progress < 0.72
        ) {
          const middle =
            (progress -
              0.333) /
            0.387;

          trajectory =
            1 +
            Math.sin(
              middle *
              Math.PI
            ) *
            0.08;
        } else {
          const final =
            (progress -
              0.72) /
            0.28;

          trajectory =
            1 -
            easeInCubic(
              final
            ) *
            0.08;
        }

        const angle =
          particle.dispersionAngle;

        const distance =
          particle.dispersionDistance;

        /*
          Organic curved path.
        */

        const curve =
          Math.sin(
            progress *
            Math.PI
          ) *
          particle.dispersionCurve *
          42;

        const desiredX =
          particle.welcomeX +
          Math.cos(angle) *
          distance *
          trajectory +
          Math.cos(
            angle +
            Math.PI / 2
          ) *
          curve;

        const desiredY =
          particle.welcomeY +
          Math.sin(angle) *
          distance *
          trajectory +
          Math.sin(
            angle +
            Math.PI / 2
          ) *
          curve;

        /*
          Smooth physics following.
        */

        const dx =
          desiredX -
          particle.x;

        const dy =
          desiredY -
          particle.y;

        particle.vx +=
          dx *
          0.008;

        particle.vy +=
          dy *
          0.008;

        particle.vx *=
          0.87;

        particle.vy *=
          0.87;

        particle.x +=
          particle.vx;

        particle.y +=
          particle.vy;
      }

      /* =========================================================
         ACT VI — FLOATING / DIRECTION CHANGE
         ========================================================= */

      function updateFloating(
        particle,
        elapsed
      ) {
        const progress =
          clamp(
            (elapsed -
              PHASE_DISPERSION) /
            (PHASE_FLOAT -
              PHASE_DISPERSION),
            0,
            1
          );

        const time =
          elapsed * 0.002;

        /*
          Short calm floating phase.
        */

        const floatingX =
          Math.sin(
            time +
            particle.floatOffset
          ) *
          particle.floatAmplitude;

        const floatingY =
          Math.cos(
            time * 0.8 +
            particle.floatOffset
          ) *
          particle.floatAmplitude *
          0.7;

        particle.vx *=
          0.94;

        particle.vy *=
          0.94;

        particle.x +=
          floatingX *
          0.018;

        particle.y +=
          floatingY *
          0.018;

        /*
          Direction gradually changes
          toward TO MY PORTFOLIO.
        */

        const dx =
          particle.portfolioX -
          particle.x;

        const dy =
          particle.portfolioY -
          particle.y;

        const attraction =
          lerp(
            0.00035,
            0.00115,
            easeInOutCubic(
              progress
            )
          );

        particle.vx +=
          dx *
          attraction;

        particle.vy +=
          dy *
          attraction;

        particle.vx *=
          0.95;

        particle.vy *=
          0.95;

        particle.x +=
          particle.vx;

        particle.y +=
          particle.vy;
      }

      /* =========================================================
         ACT VII — MIGRATION → TO MY PORTFOLIO
         ========================================================= */

      function updateMigration(
        particle,
        elapsed
      ) {
        const progress =
          clamp(
            (elapsed -
              PHASE_FLOAT) /
            (PHASE_MIGRATION -
              PHASE_FLOAT),
            0,
            1
          );

        const eased =
          easeInOutCubic(
            progress
          );

        const targetX =
          particle.portfolioX;

        const targetY =
          particle.portfolioY;

        /*
          Small Bézier-like arc.
        */

        const arc =
          Math.sin(
            progress *
            Math.PI
          ) *
          8;

        const arcX =
          arc *
          particle.driftX;

        const arcY =
          arc *
          particle.driftY;

        const desiredX =
          lerp(
            particle.x,
            targetX,
            eased * 0.18
          ) +
          arcX;

        const desiredY =
          lerp(
            particle.y,
            targetY,
            eased * 0.18
          ) +
          arcY;

        const dx =
          desiredX -
          particle.x;

        const dy =
          desiredY -
          particle.y;

        const attraction =
          lerp(
            0.0011,
            0.0046,
            eased
          );

        particle.vx +=
          dx *
          attraction;

        particle.vy +=
          dy *
          attraction;

        particle.vx *=
          0.89;

        particle.vy *=
          0.89;

        particle.x +=
          particle.vx;

        particle.y +=
          particle.vy;

        /*
          Final settling.
        */

        const remaining =
          1 - progress;

        if (
          remaining < 0.12
        ) {
          const settleProgress =
            (0.12 -
              remaining) /
            0.12;

          const settle =
            easeOutCubic(
              settleProgress
            );

          particle.x =
            lerp(
              particle.x,
              targetX,
              settle * 0.38
            );

          particle.y =
            lerp(
              particle.y,
              targetY,
              settle * 0.38
            );

          particle.vx *=
            0.72;

          particle.vy *=
            0.72;
        }

        if (
          elapsed >=
          PHASE_MIGRATION
        ) {
          particle.x =
            targetX;

          particle.y =
            targetY;

          particle.vx = 0;
          particle.vy = 0;
        }
      }

      /* =========================================================
         ACT VIII — DEPARTURE
         ========================================================= */

      function updateDeparture(
        particle,
        elapsed
      ) {
        const progress =
          clamp(
            (elapsed -
              PHASE_MIGRATION) /
            (PHASE_DEPARTURE -
              PHASE_MIGRATION),
            0,
            1
          );

        /*
          First part:
          remain close to text.

          Middle:
          start moving.

          End:
          accelerate away.
        */

        const movement =
          easeInCubic(
            progress
          );

        const angle =
          particle.dispersionAngle +
          particle.migrationBias *
          0.8;

        const acceleration =
          movement *
          movement *
          0.65;

        particle.vx +=
          Math.cos(angle) *
          acceleration;

        particle.vy +=
          Math.sin(angle) *
          acceleration;

        particle.vx *=
          0.985;

        particle.vy *=
          0.985;

        particle.x +=
          particle.vx;

        particle.y +=
          particle.vy;

        /*
          Fade gradually.
        */

        if (
          progress > 0.55
        ) {
          const fadeProgress =
            (progress - 0.55) /
            0.45;

          particle.alpha =
            particle.alpha *
            (1 -
              easeInCubic(
                fadeProgress
              ) *
              0.035);
        }
      }

      /* =========================================================
         PARTICLE UPDATE
         ========================================================= */

      function updateParticle(
        particle,
        elapsed
      ) {
        if (
          elapsed <
          PHASE_ARRIVAL
        ) {
          updateArrival(
            particle,
            elapsed
          );
        }

        else if (
          elapsed <
          PHASE_GUIDE
        ) {
          updateGuidePhase(
            particle,
            elapsed
          );
        }

        else if (
          elapsed <
          PHASE_WELCOME
        ) {
          updateWelcome(
            particle,
            elapsed
          );
        }

        else if (
          elapsed <
          PHASE_BREATHE
        ) {
          updateBreathing(
            particle,
            elapsed
          );
        }

        else if (
          elapsed <
          PHASE_DISPERSION
        ) {
          updateDispersion(
            particle,
            elapsed
          );
        }

        else if (
          elapsed <
          PHASE_FLOAT
        ) {
          updateFloating(
            particle,
            elapsed
          );
        }

        else if (
          elapsed <
          PHASE_MIGRATION
        ) {
          updateMigration(
            particle,
            elapsed
          );
        }

        else if (
          elapsed <
          PHASE_DEPARTURE
        ) {
          updateDeparture(
            particle,
            elapsed
          );
        }

        else {
          /*
            Final residual movement.
          */

          particle.x +=
            particle.vx;

          particle.y +=
            particle.vy;

          particle.vx *=
            0.99;

          particle.vy *=
            0.99;
        }

        updateTrail(
          particle
        );
      }

      /* =========================================================
         ATMOSPHERE
         ========================================================= */

      function drawAtmosphere() {
        const gradient =
          ctx.createRadialGradient(
            width / 2,
            height / 2,
            0,
            width / 2,
            height / 2,
            Math.max(
              width,
              height
            ) * 0.65
          );

        gradient.addColorStop(
          0,
          'rgba(14,171,106,0.035)'
        );

        gradient.addColorStop(
          0.55,
          'rgba(10,81,54,0.018)'
        );

        gradient.addColorStop(
          1,
          'rgba(6,38,25,0)'
        );

        ctx.fillStyle =
          gradient;

        ctx.fillRect(
          0,
          0,
          width,
          height
        );
      }

      /* =========================================================
         DRAW FRAME
         ========================================================= */

      function draw(time) {
        ctx.clearRect(
          0,
          0,
          width,
          height
        );

        drawAtmosphere();

        /*
          Trails behind particles.
        */

        particles.forEach(
          particle => {
            drawTrail(
              particle
            );
          }
        );

        /*
          Depth sorting.
        */

        const sorted =
          particles
            .slice()
            .sort(
              (a, b) =>
                a.depth -
                b.depth
            );

        sorted.forEach(
          particle => {
            let boost = 1;

            if (
              time >=
                PHASE_GUIDE &&
              time <
                PHASE_BREATHE
            ) {
              boost = 1.45;
            }

            if (
              time >=
                PHASE_FLOAT &&
              time <
                PHASE_MIGRATION
            ) {
              boost = 1.1;
            }

            drawParticle(
              particle,
              particle.x,
              particle.y,
              particle.alpha,
              time * 0.001,
              boost
            );
          }
        );
      }

      /* =========================================================
         BRIDGE → EXISTING NARRATIVE FIREFLY
         ========================================================= */

      function bridgeToNarrativeFirefly() {
        const narrative =
          document.getElementById(
            'portfolio-firefly'
          );

        if (
          !narrative ||
          !particles.length
        ) {
          return;
        }

        const guide =
          particles.find(
            particle =>
              particle.isGuide
          );

        if (!guide) return;

        narrative.dataset.introHandoff =
          'true';

        narrative.dataset.handoffX =
          String(guide.x);

        narrative.dataset.handoffY =
          String(guide.y);

        narrative.style.left =
          `${guide.x}px`;

        narrative.style.top =
          `${guide.y}px`;

        narrative.style.opacity =
          '1';

        narrative.style.transition =
          'opacity 250ms ease';
      }

      /* =========================================================
         FINISH
         ========================================================= */

      function finishIntro() {
        if (finished) return;

        finished = true;

        if (animationFrame) {
          cancelAnimationFrame(
            animationFrame
          );
        }

        bridgeToNarrativeFirefly();

        if (mainContent) {
          mainContent.style.opacity =
            '1';
        }

        intro.style.transition =
          'opacity 650ms ease';

        intro.style.opacity =
          '0';

        setTimeout(() => {
          document.body.style.overflow =
            '';

          intro.remove();
        }, 700);
      }

      /* =========================================================
         REDUCED MOTION
         ========================================================= */

      function runReducedMotion() {
        const text =
          document.createElement('div');

        text.textContent =
          'TO MY PORTFOLIO';

        Object.assign(text.style, {
          position: 'absolute',
          inset: '0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '24px',
          fontFamily: '"Fraunces", Georgia, serif',
          fontWeight: '800',
          fontSize: 'clamp(2.8rem, 10vw, 8rem)',
          color: COLORS.gold
        });

        intro.appendChild(text);

        setTimeout(
          finishIntro,
          650
        );
      }

      /* =========================================================
         FAILSAFE
         ========================================================= */

      const failsafe =
        setTimeout(() => {
          if (!finished) {
            finishIntro();
          }
        }, PHASE_FINISH + 1500);

      /* =========================================================
         ANIMATION LOOP
         ========================================================= */

      function animate(now) {
        if (finished) return;

        const elapsed =
          now - startTime;

        particles.forEach(
          particle => {
            updateParticle(
              particle,
              elapsed
            );
          }
        );

        draw(elapsed);

        if (
          elapsed >=
          PHASE_FINISH
        ) {
          clearTimeout(
            failsafe
          );

          finishIntro();
          return;
        }

        animationFrame =
          requestAnimationFrame(
            animate
          );
      }

      /* =========================================================
         INIT
         ========================================================= */

      if (reducedMotion) {
        runReducedMotion();
        return;
      }

      resize();

      window.addEventListener(
        'resize',
        resize,
        { passive: true }
      );

      createParticles();

      requestAnimationFrame(
        animate
      );

    })();
});

/* ==========================================================================
   摩擦接合用スタッドボルト研究会 共通スクリプト
   全ページ共通で読み込まれます。各ページ固有の処理も、対象要素が
   存在するときだけ動くようにしてあるので、1ファイルで問題ありません。
   ========================================================================== */
(function () {
  'use strict';

  /* ------------------------------------------------------------------
     1. スマホ用ハンバーガーメニューの開閉
     ------------------------------------------------------------------ */
  var hamburger = document.getElementById('hamburger');
  var mobileMenu = document.getElementById('mobileMenu');

  if (hamburger && mobileMenu) {
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.addEventListener('click', function () {
      var isOpen = mobileMenu.classList.toggle('open');
      // アイコンの切り替えは CSS (.hamburger.is-open) 側で行う
      hamburger.classList.toggle('is-open', isOpen);
      hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  }

  /* ------------------------------------------------------------------
     2. スクロールに合わせたフェードイン表示（.reveal）
     ------------------------------------------------------------------ */
  var revealItems = document.querySelectorAll('.reveal');
  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (revealItems.length) {
    if (prefersReduced || !('IntersectionObserver' in window)) {
      // アニメーションを好まない設定・非対応ブラウザでは最初から表示
      Array.prototype.forEach.call(revealItems, function (el) {
        el.classList.add('in');
      });
    } else {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15 });

      Array.prototype.forEach.call(revealItems, function (el) {
        io.observe(el);
      });
    }
  }

  /* ------------------------------------------------------------------
     3. 施工事例ページ：サムネイルをクリックしてメイン写真を切り替え
        （worka.html / workb.html / workc.html でのみ動作）
     ------------------------------------------------------------------ */
  var mainImg = document.getElementById('mainImg');
  var mainCaption = document.getElementById('mainCaption');
  var thumbs = document.querySelectorAll('.work-thumb');

  if (mainImg && thumbs.length) {
    Array.prototype.forEach.call(thumbs, function (btn) {
      btn.addEventListener('click', function () {
        Array.prototype.forEach.call(thumbs, function (b) {
          b.classList.remove('active');
        });
        btn.classList.add('active');

        var img = btn.querySelector('img');
        if (img) {
          mainImg.src = img.getAttribute('data-full') || img.src;
          mainImg.alt = img.alt;
        }
        if (mainCaption) {
          // textContent なので、値がHTMLとして解釈されることはありません
          mainCaption.textContent = btn.getAttribute('data-caption') || '';
        }
      });
    });
  }

  /* ------------------------------------------------------------------
     4. 資料ダウンロードフォームの出し分け
        （download-form.html でのみ動作）
        URLの ?doc= の値は、下記 DOCS に定義したものだけを受け付けます。
     ------------------------------------------------------------------ */
  var dlFrame = document.getElementById('dlFormFrame');

  if (dlFrame) {
    var DOCS = {
      catalog: {
        name: 'カタログ',
        form: 'https://docs.google.com/forms/d/e/1FAIpQLSeoygHRSfJfextdIWXkahhlxCnXbsU0lA60n5s3N59_Gw-z_Q/viewform?embedded=true'
      },
      gijutsu: {
        name: '技術資料',
        form: 'https://docs.google.com/forms/d/e/1FAIpQLSdiwCZtNZxs36KCl38lHOhsA7Jric7Q8aEqeq6zRAttUSKlqA/viewform?embedded=true'
      }
    };
    // 旧リンク（?doc=pamphlet / ?doc=manual）も受け付ける
    var ALIAS = { pamphlet: 'catalog', manual: 'gijutsu' };
    var has = function (obj, key) {
      return Object.prototype.hasOwnProperty.call(obj, key);
    };

    var key = new URLSearchParams(location.search).get('doc') || 'gijutsu';
    if (has(ALIAS, key)) { key = ALIAS[key]; }

    // 定義済みのキー以外はすべて既定値（技術資料）にフォールバック
    var doc = has(DOCS, key) ? DOCS[key] : DOCS.gijutsu;

    var targetName = document.getElementById('targetName');
    if (targetName) { targetName.textContent = doc.name; }
    dlFrame.src = doc.form;
  }
})();

/* =====================================================
   Blog Post Data
===================================================== */
const POSTS = [
  {
    id: 1,
    title: "Unity Shader 入门：理解渲染管线与 Pass",
    category: "游戏开发",
    date: "2026-03-15",
    emoji: "🎮",
    coverColor: "linear-gradient(135deg, #6c63ff, #a29bfe)",
    summary: "从零开始理解 Unity 的渲染流程，掌握 Vertex Shader 与 Fragment Shader 的工作原理。",
    tags: ["Unity", "Shader", "HLSL"],
    readTime: "8 分钟",
    views: 1240,
    content: `
      <h3>什么是渲染管线？</h3>
      <p>渲染管线（Render Pipeline）是 GPU 将 3D 场景数据转化为 2D 屏幕像素的完整流程。理解它是写好 Shader 的第一步。</p>
      <p>在 Unity 中，主要的渲染管线有三种：Built-in、URP（Universal Render Pipeline）、HDRP（High Definition Render Pipeline）。</p>

      <h3>Vertex Shader 阶段</h3>
      <p>顶点着色器负责将模型的顶点坐标从对象空间（Object Space）变换到裁剪空间（Clip Space）。核心操作是 MVP 矩阵变换：</p>
      <pre>// HLSL 示例
float4 vert(float4 pos : POSITION) : SV_POSITION {
    return UnityObjectToClipPos(pos);
}</pre>

      <h3>Fragment Shader 阶段</h3>
      <p>片段着色器（也叫像素着色器）决定每个像素的最终颜色。这里可以进行光照计算、纹理采样等操作。</p>
      <pre>// 简单的纯色输出
fixed4 frag() : SV_Target {
    return fixed4(1, 0.5, 0, 1); // 橙色
}</pre>

      <h3>Pass 与 SubShader</h3>
      <p>一个 Shader 文件可以包含多个 <code>SubShader</code>，每个 SubShader 包含一个或多个 <code>Pass</code>。GPU 会选择第一个硬件支持的 SubShader 执行。不同的 Pass 可以实现多次渲染，从而实现描边、阴影等效果。</p>

      <p>掌握这些基础知识后，你就可以开始尝试编写自定义的光照模型、溶解效果、扫描线等进阶 Shader 了。</p>
    `
  },
  {
    id: 2,
    title: "CSS Grid 布局完全指南：从基础到实战",
    category: "前端",
    date: "2026-03-08",
    emoji: "🌐",
    coverColor: "linear-gradient(135deg, #00b894, #00cec9)",
    summary: "Grid 是目前最强大的 CSS 布局工具，本文带你系统掌握 Grid 的所有核心属性和实用技巧。",
    tags: ["CSS", "布局", "前端"],
    readTime: "10 分钟",
    views: 2056,
    content: `
      <h3>为什么选择 Grid？</h3>
      <p>CSS Grid 是专为二维布局设计的系统，相比 Flexbox（一维），Grid 可以同时控制行和列，非常适合页面级布局。</p>

      <h3>基础用法</h3>
      <pre>.container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: auto;
  gap: 24px;
}</pre>
      <p><code>repeat(3, 1fr)</code> 创建三列等宽布局，<code>gap</code> 控制间距。</p>

      <h3>命名区域</h3>
      <p>Grid 支持通过 <code>grid-template-areas</code> 命名布局区域，代码可读性极强：</p>
      <pre>.container {
  grid-template-areas:
    "header header header"
    "sidebar main main"
    "footer footer footer";
}</pre>

      <h3>实战：响应式卡片瀑布流</h3>
      <p>使用 <code>auto-fill</code> 和 <code>minmax</code> 可以实现无需 Media Query 的自适应网格：</p>
      <pre>grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));</pre>
      <p>这行代码的含义：每列最小 300px，最大撑满剩余空间；列数由容器宽度自动决定。现在本文的博客卡片就用了这个技巧。</p>
    `
  },
  {
    id: 3,
    title: "技能树设计模式：如何用数据驱动技能系统",
    category: "游戏开发",
    date: "2026-02-28",
    emoji: "⚔️",
    coverColor: "linear-gradient(135deg, #e17055, #fd79a8)",
    summary: "分享一套在实际项目中验证过的技能系统架构，包含技能数据表、状态机和技能编辑器设计思路。",
    tags: ["游戏设计", "架构", "C#"],
    readTime: "12 分钟",
    views: 3400,
    content: `
      <h3>核心设计目标</h3>
      <p>一个健壮的技能系统需要满足：数据与逻辑分离、易于策划编辑、支持运行时动态加载，以及方便后续扩展。</p>

      <h3>数据层：Excel → ScriptableObject</h3>
      <p>技能数据通过 Excel 表格维护，通过工具链自动导出为 <code>ScriptableObject</code>。每条技能包含：</p>
      <pre>public class SkillData : ScriptableObject {
    public int skillId;
    public string skillName;
    public float castTime;
    public float cooldown;
    public List&lt;SkillEffect&gt; effects;
}</pre>

      <h3>逻辑层：技能状态机</h3>
      <p>技能执行过程抽象为状态机：<code>Idle → Casting → Executing → Cooling</code>。每个状态有明确的 Enter / Update / Exit 回调，大大降低耦合度。</p>

      <h3>编辑器工具</h3>
      <p>基于 Unity EditorWindow 开发了可视化技能编辑器，支持时间轴预览技能帧事件，策划可以直接在编辑器内调试技能参数，减少反复沟通的成本。</p>

      <p>这套方案在我们项目中支撑了 200+ 个技能，维护成本较低，推荐有类似需求的同学参考。</p>
    `
  },
  {
    id: 4,
    title: "Node.js 性能优化实践：从 1000ms 到 80ms",
    category: "后端",
    date: "2026-02-18",
    emoji: "⚡",
    coverColor: "linear-gradient(135deg, #fdcb6e, #e17055)",
    summary: "记录一次真实的接口性能优化过程，涵盖数据库索引、缓存策略、代码层面的多项优化手段。",
    tags: ["Node.js", "性能", "数据库"],
    readTime: "9 分钟",
    views: 1876,
    content: `
      <h3>问题背景</h3>
      <p>线上某查询接口 P99 延迟超过 1000ms，用户体验极差。通过 APM 工具定位，发现主要耗时在数据库查询阶段。</p>

      <h3>第一步：加索引</h3>
      <p>查看 EXPLAIN 输出，发现核心查询没有命中索引，全表扫描。为 <code>user_id</code> 和 <code>created_at</code> 字段添加复合索引后，查询从 800ms 降至 200ms。</p>
      <pre>CREATE INDEX idx_user_time ON orders(user_id, created_at DESC);</pre>

      <h3>第二步：引入 Redis 缓存</h3>
      <p>对热点数据（用户基本信息、配置项）引入 Redis 缓存，设置合理的 TTL，绝大多数请求不再触达数据库。</p>

      <h3>第三步：异步并行化</h3>
      <p>原本串行的多个查询改为并行：</p>
      <pre>// Before: 串行 ~300ms
const user = await getUser(id);
const orders = await getOrders(id);

// After: 并行 ~150ms
const [user, orders] = await Promise.all([
  getUser(id), getOrders(id)
]);</pre>

      <h3>最终结果</h3>
      <p>经过三轮优化，接口 P99 从 1000ms 降至 80ms，P50 降至 30ms 以内。性能优化没有银弹，但索引、缓存、并行化这三板斧往往能解决大部分问题。</p>
    `
  },
  {
    id: 5,
    title: "2026 的一些思考：关于成长与节奏",
    category: "随笔",
    date: "2026-01-10",
    emoji: "🌿",
    coverColor: "linear-gradient(135deg, #a29bfe, #74b9ff)",
    summary: "新年伊始，写下一些关于职业发展、学习方法和生活节奏的思考与感悟。",
    tags: ["随笔", "成长", "生活"],
    readTime: "5 分钟",
    views: 892,
    content: `
      <h3>关于快与慢</h3>
      <p>技术行业变化极快，新框架新工具层出不穷。但我越来越觉得，真正重要的是底层原理的积累，而不是追逐每一个新出的库。学得慢一些，但学得透彻，往往走得更远。</p>

      <h3>关于输出的力量</h3>
      <p>写博客已经坚持了两年。最大的收获不是流量，而是写作过程本身——它迫使你把模糊的理解变成清晰的表达，这个过程会暴露很多知识盲点。</p>
      <p>"费曼技巧"说的就是这个道理：如果你不能向别人简单解释一件事，你其实还没有真正理解它。</p>

      <h3>关于节奏</h3>
      <p>去年犯了一个错误：给自己设定了太多目标，结果大多数都没完成，反而产生了焦虑。今年决定聚焦，每个季度只设定 1-2 个核心目标，做深做透，不贪多。</p>

      <p>希望 2026 年，我们都能找到属于自己的节奏。共勉。</p>
    `
  },
  {
    id: 6,
    title: "Vue 3 Composition API 深度解析",
    category: "前端",
    date: "2025-12-20",
    emoji: "💚",
    coverColor: "linear-gradient(135deg, #55efc4, #00b894)",
    summary: "全面解析 Vue 3 Composition API 的设计理念，以及如何用 Composables 替代 Mixins 提升代码复用性。",
    tags: ["Vue3", "前端", "JavaScript"],
    readTime: "11 分钟",
    views: 2300,
    content: `
      <h3>为什么需要 Composition API？</h3>
      <p>Options API 在处理复杂组件时有明显缺陷：相关逻辑被分散在 <code>data</code>、<code>methods</code>、<code>computed</code> 等不同选项中，难以复用和维护。Composition API 解决了这个问题。</p>

      <h3>核心 API 速览</h3>
      <pre>import { ref, computed, onMounted } from 'vue'

const count = ref(0)               // 响应式基本值
const double = computed(() => count.value * 2) // 计算属性

onMounted(() => {
  console.log('组件挂载完成')
})</pre>

      <h3>Composables：逻辑复用的正确姿势</h3>
      <p>Composable 函数是 Composition API 的最佳实践，类似 React Hooks：</p>
      <pre>// useCounter.js
export function useCounter(initial = 0) {
  const count = ref(initial)
  const increment = () => count.value++
  const reset = () => count.value = initial
  return { count, increment, reset }
}

// 在任意组件中使用
const { count, increment } = useCounter(10)</pre>

      <h3>与 Mixins 对比</h3>
      <p>相比 Mixins，Composables 的来源完全清晰（通过解构明确），不存在属性覆盖冲突，支持参数传入，可以在同一组件中多次使用同一个 Composable（传不同参数）。这些优势使 Composables 成为 Vue 3 首选的逻辑复用方式。</p>
    `
  }
];

/* =====================================================
   Render Posts
===================================================== */
const postsGrid = document.getElementById('postsGrid');
const filterBtns = document.querySelectorAll('.filter-btn');
let currentFilter = 'all';

function createPostCard(post) {
  const card = document.createElement('div');
  card.className = 'post-card reveal';
  card.dataset.category = post.category;
  card.innerHTML = `
    <div class="post-cover" style="background: ${post.coverColor}">
      <span style="filter: drop-shadow(0 2px 8px rgba(0,0,0,0.3))">${post.emoji}</span>
    </div>
    <div class="post-body">
      <div class="post-meta">
        <span class="post-cat">${post.category}</span>
        <span class="post-date">${post.date}</span>
      </div>
      <h3 class="post-title">${post.title}</h3>
      <p class="post-summary">${post.summary}</p>
    </div>
    <div class="post-footer">
      <div class="post-tags">${post.tags.map(t => `<span>${t}</span>`).join('')}</div>
      <span class="read-more">阅读 →</span>
    </div>
  `;
  card.addEventListener('click', () => openModal(post));
  return card;
}

function renderPosts(filter) {
  postsGrid.innerHTML = '';
  const filtered = filter === 'all' ? POSTS : POSTS.filter(p => p.category === filter);
  filtered.forEach((post, i) => {
    const card = createPostCard(post);
    card.style.transitionDelay = `${i * 0.07}s`;
    postsGrid.appendChild(card);
  });
  // Trigger reveal for newly rendered cards
  setTimeout(() => observeReveal(), 50);
}

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = btn.dataset.filter;
    renderPosts(currentFilter);
  });
});

renderPosts('all');

/* =====================================================
   Modal
===================================================== */
const modalOverlay = document.getElementById('modalOverlay');
const modalContent = document.getElementById('modalContent');
const modalClose = document.getElementById('modalClose');

function openModal(post) {
  modalContent.innerHTML = `
    <h2>${post.emoji} ${post.title}</h2>
    <div class="modal-meta">
      <span>📂 ${post.category}</span>
      <span>📅 ${post.date}</span>
      <span>⏱ ${post.readTime}</span>
      <span>👁 ${post.views.toLocaleString()} 次阅读</span>
    </div>
    <div class="modal-body">${post.content}</div>
  `;
  modalOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  modalOverlay.classList.remove('open');
  document.body.style.overflow = '';
}

modalClose.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', e => {
  if (e.target === modalOverlay) closeModal();
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal();
});

/* =====================================================
   Navbar scroll
===================================================== */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
  document.getElementById('backTop').classList.toggle('show', window.scrollY > 400);
});

/* =====================================================
   Mobile nav toggle
===================================================== */
document.getElementById('navToggle').addEventListener('click', () => {
  document.getElementById('navLinks').classList.toggle('open');
});
document.querySelectorAll('.nav-links a').forEach(a => {
  a.addEventListener('click', () => {
    document.getElementById('navLinks').classList.remove('open');
  });
});

/* =====================================================
   Back to top
===================================================== */
document.getElementById('backTop').addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* =====================================================
   Intersection Observer - Reveal animations
===================================================== */
function observeReveal() {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.reveal').forEach(el => io.observe(el));
}
observeReveal();

// Apply reveal class to sections
document.querySelectorAll('.info-card, .skill-group, .contact-item').forEach(el => {
  el.classList.add('reveal');
});
observeReveal();

/* =====================================================
   Skill Bars Animation
===================================================== */
const skillIo = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.skill-fill').forEach(bar => {
        bar.style.width = bar.dataset.width + '%';
      });
      skillIo.unobserve(e.target);
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.skill-group').forEach(el => skillIo.observe(el));

/* =====================================================
   Stats Counter Animation
===================================================== */
function animateCounter(el) {
  const target = parseInt(el.dataset.target);
  const duration = 1800;
  const step = target / (duration / 16);
  let current = 0;
  const timer = setInterval(() => {
    current = Math.min(current + step, target);
    el.textContent = Math.floor(current).toLocaleString();
    if (current >= target) clearInterval(timer);
  }, 16);
}

const statsIo = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.stat-num').forEach(animateCounter);
      statsIo.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });

statsIo.observe(document.querySelector('.stats-bar'));

/* =====================================================
   Contact Form
===================================================== */
document.getElementById('contactForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const name = document.getElementById('formName').value.trim();
  const tip = document.getElementById('formTip');
  tip.style.color = '#55efc4';
  tip.textContent = `✓ 消息已发送！谢谢你 ${name}，我会尽快回复。`;
  this.reset();
  setTimeout(() => { tip.textContent = ''; }, 5000);
});

/* =====================================================
   Active nav link on scroll
===================================================== */
const sections = document.querySelectorAll('section[id]');
const navAs = document.querySelectorAll('.nav-links a');

const navIo = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      navAs.forEach(a => a.classList.remove('active'));
      const active = document.querySelector(`.nav-links a[href="#${e.target.id}"]`);
      if (active) active.style.color = 'var(--primary-light)';
    } else {
      const link = document.querySelector(`.nav-links a[href="#${e.target.id}"]`);
      if (link) link.style.color = '';
    }
  });
}, { threshold: 0.5 });

sections.forEach(s => navIo.observe(s));

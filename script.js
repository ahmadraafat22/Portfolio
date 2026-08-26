/**
 * Ahmed Raafat — Senior Backend .NET Developer Portfolio
 * Interactivity: Code Workstation Tabs, Architecture Explorer,
 * Copy Clipboard, Form Feedback, Active Nav & Scroll Reveals
 */

document.addEventListener('DOMContentLoaded', () => {
  initWorkstationTabs();
  initArchitectureExplorer();
  initContactForm();
  initCopyEmail();
  initScrollReveals();
  initActiveNav();
  initScrollTop();
  initMobileNav();
});

/**
 * 1. Hero Code Workstation Tab Switcher
 */
function initWorkstationTabs() {
  const tabs = document.querySelectorAll('.code-tab');
  const contents = document.querySelectorAll('.code-tab-content');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetId = tab.getAttribute('data-tab');

      // Update active tab button
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      // Update active content
      contents.forEach(c => {
        if (c.id === targetId) {
          c.classList.add('active');
        } else {
          c.classList.remove('active');
        }
      });
    });
  });
}

/**
 * 2. Interactive Backend Architecture Explorer
 */
const architectureData = {
  'layer-client': {
    title: 'Client / External Consumer',
    subtitle: 'Entrypoint &bull; HTTPS REST invocation with JWT Auth',
    desc: 'All inbound traffic enters via secure HTTPS REST endpoints with structured JSON payloads, bearer token authorization headers, and correlation tracking IDs for end-to-end request tracing.',
    tags: ['HTTPS / REST', 'Bearer JWT', 'JSON Contracts', 'OpenAPI / Swagger'],
    code: `POST /api/v1/orders HTTP/1.1
Host: api.nexuserp.com
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
Content-Type: application/json

{
  "customerId": "8f3d1b22-92a0-45f8-b3d4",
  "items": [{ "productId": "104", "quantity": 5 }]
}`
  },
  'layer-api': {
    title: 'API & Presentation Layer',
    subtitle: 'Controllers &bull; Routing &bull; Global Exception Middleware',
    desc: 'Lightweight ASP.NET Core controllers act strictly as HTTP dispatchers without business logic. Global Exception Handling Middleware intercepts unhandled errors and produces RFC 7807 ProblemDetails.',
    tags: ['ASP.NET Core 8', 'Controllers', 'Global Middleware', 'JWT Auth Policies', 'Swagger UI'],
    code: `[HttpPost]
[Authorize(Roles = "Admin,Manager")]
public async Task<IActionResult> CreateOrder(
    [FromBody] CreateOrderCommand command)
{
    var orderId = await Mediator.Send(command);
    return CreatedAtAction(nameof(GetById), new { id = orderId }, orderId);
}`
  },
  'layer-app': {
    title: 'Application Layer (Core)',
    subtitle: 'MediatR CQRS &bull; FluentValidation &bull; AutoMapper',
    desc: 'The brain of the application. Requests are handled as distinct Commands or Queries using MediatR. Validation Pipeline Behaviors validate inputs before reaching command handlers.',
    tags: ['CQRS Pattern', 'MediatR Pipeline', 'FluentValidation', 'AutoMapper', 'DTOs'],
    code: `public class CreateOrderCommandHandler 
    : IRequestHandler<CreateOrderCommand, Guid>
{
    private readonly IUnitOfWork _unitOfWork;
    public async Task<Guid> Handle(
        CreateOrderCommand request, CancellationToken ct)
    {
        var order = Order.Create(request.CustomerId);
        await _unitOfWork.Orders.AddAsync(order, ct);
        await _unitOfWork.CommitAsync(ct);
        return order.Id;
    }
}`
  },
  'layer-domain': {
    title: 'Domain Layer (Enterprise Core)',
    subtitle: 'Entities &bull; Value Objects &bull; Aggregate Roots &bull; Rules',
    desc: 'Pure C# with zero external dependencies. Contains enterprise entities, encapsulated business invariants, domain exceptions, and domain events ensuring data integrity at all times.',
    tags: ['Rich Domain Model', 'Encapsulation', 'Value Objects', 'Invariants'],
    code: `public class Order : AggregateRoot
{
    public Guid CustomerId { get; private set; }
    public OrderStatus Status { get; private set; }
    private readonly List<OrderItem> _items = new();
    
    public void AddItem(Guid productId, int quantity, decimal unitPrice)
    {
        if (quantity <= 0) 
            throw new DomainRuleException("Quantity must be positive.");
        _items.Add(new OrderItem(productId, quantity, unitPrice));
    }
}`
  },
  'layer-infra': {
    title: 'Infrastructure & Persistence Layer',
    subtitle: 'Entity Framework Core &bull; SQL Server &bull; Migrations',
    desc: 'Implements repository interfaces defined in the Application layer. Configures database tables, relationship constraints, indexes, and executes Code-First migrations with transaction safety.',
    tags: ['EF Core 8', 'SQL Server', 'Repository & UnitOfWork', 'Code First Migrations'],
    code: `public class ApplicationDbContext : DbContext, IApplicationDbContext
{
    public DbSet<Order> Orders => Set<Order>();
    public DbSet<Product> Products => Set<Product>();

    protected override void OnModelCreating(ModelBuilder builder)
    {
        builder.ApplyConfigurationsFromAssembly(
            typeof(ApplicationDbContext).Assembly);
    }
}`
  }
};

function initArchitectureExplorer() {
  const stepCards = document.querySelectorAll('.arch-step-card');
  const titleEl = document.getElementById('arch-panel-title');
  const subtitleEl = document.getElementById('arch-panel-subtitle');
  const descEl = document.getElementById('arch-panel-desc');
  const tagsEl = document.getElementById('arch-panel-tags');
  const codeEl = document.getElementById('arch-panel-code');

  if (!stepCards.length || !titleEl) return;

  stepCards.forEach(card => {
    card.addEventListener('click', () => {
      const layerKey = card.getAttribute('data-layer');
      const data = architectureData[layerKey];
      if (!data) return;

      // Update active card styling
      stepCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');

      // Update panel content with smooth animation
      titleEl.textContent = data.title;
      subtitleEl.innerHTML = data.subtitle;
      descEl.textContent = data.desc;

      // Update tags
      tagsEl.innerHTML = data.tags.map(t => `<span class="arch-tech-pill">${t}</span>`).join('');

      // Update code
      codeEl.innerHTML = `<pre><code>${escapeHtml(data.code)}</code></pre>`;
    });
  });
}

function escapeHtml(string) {
  return String(string)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * 3. Contact Form Submission
 */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const responseMsg = document.getElementById('form-response-msg');
  const submitBtn = document.getElementById('form-submit-btn');

  if (!form || !responseMsg) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span>Sending...</span>';

    setTimeout(() => {
      responseMsg.classList.add('visible');
      form.reset();
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<span>Send Message</span>';

      setTimeout(() => {
        responseMsg.classList.remove('visible');
      }, 5000);
    }, 600);
  });
}

/**
 * 4. Copy Email to Clipboard
 */
function initCopyEmail() {
  const copyBtn = document.getElementById('copy-email-btn');
  const copyStatus = document.getElementById('copy-status');

  if (!copyBtn || !copyStatus) return;

  copyBtn.addEventListener('click', async () => {
    const email = copyBtn.getAttribute('data-email') || 'medorfmedo8008@gmail.com';

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(email);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = email;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }

      copyStatus.textContent = '[copied ✓]';
      copyBtn.style.borderColor = 'var(--accent)';

      setTimeout(() => {
        copyStatus.textContent = '[copy email]';
        copyBtn.style.borderColor = '';
      }, 2500);
    } catch (err) {
      console.error('Failed to copy email:', err);
    }
  });
}

/**
 * 5. Scroll Reveals with IntersectionObserver
 */
function initScrollReveals() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealElements = document.querySelectorAll('.reveal-on-scroll');

  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    revealElements.forEach(el => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    },
    {
      root: null,
      threshold: 0.08,
      rootMargin: '0px 0px -30px 0px'
    }
  );

  revealElements.forEach(el => observer.observe(el));
}

/**
 * 6. Active Nav Link on Scroll
 */
function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => link.classList.remove('active'));
        const active = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }, { threshold: 0.35 });

  sections.forEach(section => observer.observe(section));
}

/**
 * 7. Scroll to Top Button
 */
function initScrollTop() {
  const scrollTopBtn = document.getElementById('scroll-top');
  if (!scrollTopBtn) return;

  window.addEventListener('scroll', () => {
    scrollTopBtn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/**
 * 8. Mobile Hamburger Navigation
 */
function initMobileNav() {
  const hamburger = document.getElementById('nav-hamburger');
  const navLinksList = document.querySelector('.nav-links');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!hamburger || !navLinksList) return;

  hamburger.addEventListener('click', () => {
    const isOpen = navLinksList.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navLinksList.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });
}

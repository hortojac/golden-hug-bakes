// Use the published Google Forms responder URL, including forms.gle short links.
const googleFormUrl = '';

const placeholder = document.querySelector('[data-form-placeholder]');
if (googleFormUrl) {
  const open = document.createElement('a');
  open.className = 'button';
  open.href = googleFormUrl;
  open.target = '_blank';
  open.rel = 'noopener noreferrer';
  open.textContent = 'Open in Google Forms';

  const frameUrl = new URL(googleFormUrl);
  if (frameUrl.hostname === 'docs.google.com' && /^\/forms\/d\/(e\/)?[^/]+\/viewform\/?$/.test(frameUrl.pathname)) {
    frameUrl.search = '?embedded=true';
    frameUrl.hash = '';
    const frame = document.createElement('iframe');
    frame.className = 'google-form';
    frame.title = 'Golden Hug Bakes order request';
    frame.loading = 'lazy';
    frame.src = frameUrl.href;
    placeholder.replaceChildren(frame, open);
  } else {
    placeholder.replaceChildren(open);
  }
}

const inquiryForm = placeholder.querySelector('[data-inquiry-form]');
if (inquiryForm) {
  const address = document.querySelector('[data-inquiry-address]').getAttribute('href');
  inquiryForm.hidden = false;
  inquiryForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const fields = new FormData(inquiryForm);
    const name = fields.get('name').trim();
    const details = fields.get('details').trim();
    if (!name || !details) {
      const field = inquiryForm.elements.namedItem(!name ? 'name' : 'details');
      field.value = '';
      field.reportValidity();
      return;
    }
    const lines = ['Hi Golden Hug Bakes,', '', details, '', 'Name: ' + name];
    const date = fields.get('date');
    if (date) lines.push('Date needed: ' + date);
    const subject = encodeURIComponent('Golden Hug Bakes order inquiry');
    const body = encodeURIComponent(lines.join('\r\n'));
    window.location.href = address + '?subject=' + subject + '&body=' + body;
  });
}

const dialog = document.querySelector('.photo-dialog');
const modalImage = dialog.querySelector('img');
const modalCaption = dialog.querySelector('#photo-caption');
for (const link of document.querySelectorAll('.gallery-grid a')) {
  link.addEventListener('click', (event) => {
    if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    if (typeof dialog.showModal !== 'function') return;
    event.preventDefault();
    modalImage.src = link.href;
    modalCaption.textContent = link.closest('figure').querySelector('figcaption').textContent;
    dialog.showModal();
  });
}

dialog.querySelector('.close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', (event) => {
  if (event.target === dialog) dialog.close();
});

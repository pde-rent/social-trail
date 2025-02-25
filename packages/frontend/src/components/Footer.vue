<template lang="pug">
footer.bg-gh-dark-subtle.border-t.border-gh-dark-border.py-8.mt-auto
  .max-w-7xl.mx-auto.px-4.sm_px-6.lg_px-8
    .grid.grid-cols-1.md_grid-cols-4.gap-8
      each section in [{title: 'Product', links: ['Features', 'Pricing', 'API']}, {title: 'Support', links: ['Documentation', 'Guides', 'Contact Us']}, {title: 'Legal', links: ['Privacy', 'Terms', 'Cookie Policy']}]
        div
          h3.text-sm.font-semibold.text-gh-dark-fg.tracking-wider.uppercase #{section.title}
          ul.mt-4.space-y-4
            each link in section.links
              li
                a.text-base.text-gh-dark-secondary.hover_text-gh-dark-fg(href="#") #{link}

    .mt-8.border-t.border-gh-dark-border.pt-8.md_flex.md_items-center.md_justify-between
      .flex.space-x-6.md_order-2
        a.text-gh-dark-secondary.hover_text-gh-dark-fg(href="#")
          span.sr-only Twitter
          font-awesome-icon(icon="fa-brands fa-x-twitter" class="h-6 w-6")
        
        a.text-gh-dark-secondary.hover_text-gh-dark-fg(href="#")
          span.sr-only GitHub
          font-awesome-icon(icon="fa-brands fa-github" class="h-6 w-6")
      
      p.mt-8.text-base.text-gh-dark-secondary.md_mt-0.md_order-1 &copy; 2023 SocialTrail. All rights reserved.
</template> 
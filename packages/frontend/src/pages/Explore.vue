<template lang="pug">
.container.mx-auto.px-4.py-8
  // Header
  section.mb-8
    h1.text-3xl.font-bold.text-gh-dark-fg.mb-4 Explore SocialTrail
    p.text-gh-dark-secondary Discover top contributors and trending content across platforms
  
  // Search and filters
  section.mb-8
    .bg-gh-dark-subtle.rounded-lg.border.border-gh-dark-border.p-4
      .flex.flex-col.md_flex-row.gap-4
        .flex-grow
          .relative.rounded-md.shadow-sm
            input.block.w-full.py-2.pl-10.pr-3.bg-gh-dark-bg.border.border-gh-dark-border.rounded-md.focus_outline-none.focus_ring-1.focus_ring-gh-dark-primary.focus_border-gh-dark-primary.text-gh-dark-fg.placeholder-gh-dark-muted(
              type="search"
              placeholder="Search users, content, or platforms..."
            )
            .absolute.inset-y-0.left-0.pl-3.flex.items-center.pointer-events-none
              i.fas.fa-search.text-gh-dark-muted
        
        .flex.space-x-2
          select.bg-gh-dark-bg.border.border-gh-dark-border.rounded-md.py-2.px-3.text-gh-dark-fg.focus_outline-none.focus_ring-1.focus_ring-gh-dark-primary.focus_border-gh-dark-primary
            option(value="all") All Platforms
            option(value="github") GitHub
            option(value="x") X
            option(value="discord") Discord
            option(value="youtube") YouTube
          
          select.bg-gh-dark-bg.border.border-gh-dark-border.rounded-md.py-2.px-3.text-gh-dark-fg.focus_outline-none.focus_ring-1.focus_ring-gh-dark-primary.focus_border-gh-dark-primary
            option(value="recent") Most Recent
            option(value="popular") Most Popular
            option(value="trending") Trending
  
  // Top contributors
  section.mb-12
    .flex.justify-between.items-center.mb-4
      h2.text-xl.font-semibold.text-gh-dark-fg Top Contributors
      button.text-gh-dark-primary.text-sm.hover_underline View All
    
    .grid.grid-cols-1.md_grid-cols-2.lg_grid-cols-4.gap-4
      // Contributor card
      .bg-gh-dark-subtle.rounded-lg.border.border-gh-dark-border.p-4.flex.flex-col.items-center.text-center
        .relative
          img.w-20.h-20.rounded-full.border-2.border-gh-dark-border(src="https://github.com/identicons/user1.png" alt="User")
          .absolute.-bottom-1.-right-1.w-6.h-6.bg-gh-dark-primary.rounded-full.flex.items-center.justify-center.text-white.text-xs.font-bold 1
        h3.font-medium.text-gh-dark-fg.mt-3 johndoe
        p.text-sm.text-gh-dark-secondary.mt-1 Full Stack Developer
        .mt-2.flex.items-center.justify-center.space-x-2
          i.fab.fa-github
          i.fab.fa-x-twitter
          i.fab.fa-discord
      
      // Contributor card
      .bg-gh-dark-subtle.rounded-lg.border.border-gh-dark-border.p-4.flex.flex-col.items-center.text-center
        .relative
          img.w-20.h-20.rounded-full.border-2.border-gh-dark-border(src="https://github.com/identicons/user2.png" alt="User")
          .absolute.-bottom-1.-right-1.w-6.h-6.bg-gh-dark-primary.rounded-full.flex.items-center.justify-center.text-white.text-xs.font-bold 2
        h3.font-medium.text-gh-dark-fg.mt-3 sarahjones
        p.text-sm.text-gh-dark-secondary.mt-1 UX Designer
        .mt-2.flex.items-center.justify-center.space-x-2
          i.fab.fa-github
          i.fab.fa-x-twitter
          i.fab.fa-instagram
      
      // Contributor card
      .bg-gh-dark-subtle.rounded-lg.border.border-gh-dark-border.p-4.flex.flex-col.items-center.text-center
        .relative
          img.w-20.h-20.rounded-full.border-2.border-gh-dark-border(src="https://github.com/identicons/user3.png" alt="User")
          .absolute.-bottom-1.-right-1.w-6.h-6.bg-gh-dark-primary.rounded-full.flex.items-center.justify-center.text-white.text-xs.font-bold 3
        h3.font-medium.text-gh-dark-fg.mt-3 mikebrown
        p.text-sm.text-gh-dark-secondary.mt-1 DevOps Engineer
        .mt-2.flex.items-center.justify-center.space-x-2
          i.fab.fa-github
          i.fab.fa-discord
          i.fab.fa-youtube
      
      // Contributor card
      .bg-gh-dark-subtle.rounded-lg.border.border-gh-dark-border.p-4.flex.flex-col.items-center.text-center
        .relative
          img.w-20.h-20.rounded-full.border-2.border-gh-dark-border(src="https://github.com/identicons/user4.png" alt="User")
          .absolute.-bottom-1.-right-1.w-6.h-6.bg-gh-dark-primary.rounded-full.flex.items-center.justify-center.text-white.text-xs.font-bold 4
        h3.font-medium.text-gh-dark-fg.mt-3 alexwilson
        p.text-sm.text-gh-dark-secondary.mt-1 Frontend Developer
        .mt-2.flex.items-center.justify-center.space-x-2
          i.fab.fa-github
          i.fab.fa-x-twitter
          i.fab.fa-youtube
  
  // Trending content
  section.mb-12
    .flex.justify-between.items-center.mb-4
      h2.text-xl.font-semibold.text-gh-dark-fg Trending Content
      button.text-gh-dark-primary.text-sm.hover_underline View All
    
    .grid.grid-cols-1.md_grid-cols-2.gap-4
      // Content card
      .bg-gh-dark-subtle.rounded-lg.border.border-gh-dark-border.p-4
        .flex.items-start
          img.w-10.h-10.rounded-full.mr-3(src="https://github.com/identicons/user5.png" alt="User")
          .flex-grow
            .flex.justify-between
              .font-medium.text-gh-dark-fg janedoe
              .text-xs.text-gh-dark-muted 3h ago
            p.text-sm.text-gh-dark-secondary.mt-1 Just released a new open-source library for handling authentication in Vue 3 applications. Check it out and let me know what you think!
            .mt-3.flex.items-center.justify-between
              .flex.space-x-4
                .flex.items-center.text-gh-dark-muted.text-sm
                  i.fas.fa-heart.mr-1
                  span 124
                .flex.items-center.text-gh-dark-muted.text-sm
                  i.fas.fa-comment.mr-1
                  span 32
              .flex.items-center.text-gh-dark-muted.text-xs
                i.fab.fa-github.mr-1
                span GitHub
      
      // Content card
      .bg-gh-dark-subtle.rounded-lg.border.border-gh-dark-border.p-4
        .flex.items-start
          img.w-10.h-10.rounded-full.mr-3(src="https://github.com/identicons/user6.png" alt="User")
          .flex-grow
            .flex.justify-between
              .font-medium.text-gh-dark-fg davidsmith
              .text-xs.text-gh-dark-muted 8h ago
            p.text-sm.text-gh-dark-secondary.mt-1 I'm hosting a live coding session tomorrow where we'll build a full-stack app with Vue 3 and Express. Join me at 2 PM EST!
            .mt-3.flex.items-center.justify-between
              .flex.space-x-4
                .flex.items-center.text-gh-dark-muted.text-sm
                  i.fas.fa-heart.mr-1
                  span 95
                .flex.items-center.text-gh-dark-muted.text-sm
                  i.fas.fa-comment.mr-1
                  span 28
              .flex.items-center.text-gh-dark-muted.text-xs
                i.fab.fa-x-twitter.mr-1
                span X
  
  // Popular platforms
  section.mb-8
    h2.text-xl.font-semibold.mb-4.text-gh-dark-fg Popular Platforms
    .grid.grid-cols-1.md_grid-cols-3.gap-4
      // Platform card
      .bg-gh-dark-subtle.rounded-lg.border.border-gh-dark-border.p-4.flex.items-center
        i.fab.fa-github.text-4xl.mr-4
        .flex-grow
          h3.font-medium.text-gh-dark-fg GitHub
          p.text-sm.text-gh-dark-secondary.mt-1 Connect and track your open source contributions
        .ml-4
          button.px-3.py-1.text-sm.bg-gh-dark-primary.text-white.rounded-md.hover_bg-opacity-90.transition-colors Connect
      
      // Platform card
      .bg-gh-dark-subtle.rounded-lg.border.border-gh-dark-border.p-4.flex.items-center
        i.fab.fa-x-twitter.text-4xl.mr-4
        .flex-grow
          h3.font-medium.text-gh-dark-fg X
          p.text-sm.text-gh-dark-secondary.mt-1 Track your engagement on the X platform
        .ml-4
          button.px-3.py-1.text-sm.bg-gh-dark-primary.text-white.rounded-md.hover_bg-opacity-90.transition-colors Connect
      
      // Platform card
      .bg-gh-dark-subtle.rounded-lg.border.border-gh-dark-border.p-4.flex.items-center
        i.fab.fa-discord.text-4xl.mr-4
        .flex-grow
          h3.font-medium.text-gh-dark-fg Discord
          p.text-sm.text-gh-dark-secondary.mt-1 Track your community engagement and contributions
        .ml-4
          button.px-3.py-1.text-sm.bg-gh-dark-primary.text-white.rounded-md.hover_bg-opacity-90.transition-colors Connect
</template>

<script setup lang="ts">
// No special logic needed for this page
</script> 
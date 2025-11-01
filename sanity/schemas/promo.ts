export default {
  name: 'promo',
  title: 'Promo',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'categories',
      title: 'Categories',
      description: 'Select one or multiple categories',
      type: 'array',
      of: [
        {
          type: 'string',
        },
      ],
      options: {
        list: [
          { title: 'Beauty & Fashion', value: 'beauty-fashion' },
          { title: 'Luxury Events', value: 'luxury-events' },
          { title: 'Lifestyle', value: 'lifestyle' },
        ],
        layout: 'checkbox',
      },
      validation: (Rule: any) => Rule.required().min(1),
    },
    {
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Active', value: 'active' },
          { title: 'Inactive', value: 'inactive' },
          { title: 'Archived', value: 'archived' },
        ],
        layout: 'radio',
      },
      initialValue: 'active',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'mainImage',
      title: 'Main Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'hoverImage',
      title: 'Hover Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    },
    {
      name: 'heroVideo',
      title: 'Hero Video (optional)',
      description: 'Video shown at the top of the promo page. If not provided, the main image will be used.',
      type: 'file',
      options: {
        accept: 'video/*',
      },
    },
    {
      name: 'instagramFollowers',
      title: 'Instagram Followers',
      description: 'e.g., "125K" or "1.2M"',
      type: 'string',
    },
    {
      name: 'tiktokFollowers',
      title: 'TikTok Followers',
      description: 'e.g., "50K" or "500K"',
      type: 'string',
    },
    {
      name: 'instagramUrl',
      title: 'Instagram URL',
      type: 'url',
    },
    {
      name: 'tiktokUrl',
      title: 'TikTok URL',
      type: 'url',
    },
    {
      name: 'collaborations',
      title: 'Brand Collaborations',
      description: 'List of brands they have worked with',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'brandName',
              title: 'Brand Name',
              type: 'string',
            },
            {
              name: 'logo',
              title: 'Brand Logo',
              type: 'image',
            },
            {
              name: 'campaignImage',
              title: 'Campaign Image',
              type: 'image',
              options: {
                hotspot: true,
              },
            },
          ],
        },
      ],
    },
    {
      name: 'collaborationsImage',
      title: 'Collaborations Section - Cover Image',
      description: 'Image shown in the "COLLABORATIONS" section',
      type: 'image',
      options: {
        hotspot: true,
      },
    },
    {
      name: 'eventsGallery',
      title: 'Events Gallery',
      description: 'Photos from high-end events',
      type: 'array',
      of: [
        {
          type: 'image',
          options: {
            hotspot: true,
          },
        },
      ],
    },
    {
      name: 'eventsImage',
      title: 'Events Section - Cover Image',
      description: 'Image shown in the "EVENTS" section',
      type: 'image',
      options: {
        hotspot: true,
      },
    },
    {
      name: 'socialImage',
      title: 'Social Section - Main Image',
      description: 'Image shown in the "SOCIAL" section',
      type: 'image',
      options: {
        hotspot: true,
      },
    },
    {
      name: 'height',
      title: 'Height',
      type: 'string',
    },
    {
      name: 'eyes',
      title: 'Eyes',
      type: 'string',
    },
    {
      name: 'hair',
      title: 'Hair',
      type: 'string',
    },
  ],
  preview: {
    select: {
      title: 'name',
      media: 'mainImage',
      categories: 'categories',
    },
    prepare(selection: any) {
      const { title, media, categories } = selection;
      return {
        title,
        media,
        subtitle: categories ? categories.join(', ') : 'No categories',
      };
    },
  },
}

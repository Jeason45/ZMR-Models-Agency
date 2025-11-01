export default {
  name: 'actor',
  title: 'Actor',
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
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Commercial', value: 'commercial' },
          { title: 'Cinema', value: 'cinema' },
          { title: 'Theater', value: 'theater' },
        ],
        layout: 'radio',
      },
      validation: (Rule: any) => Rule.required(),
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
      description: 'Video shown at the top of the actor page. If not provided, the main image will be used.',
      type: 'file',
      options: {
        accept: 'video/*',
      },
    },
    {
      name: 'ageRange',
      title: 'Age Range',
      description: 'e.g., "25-35"',
      type: 'string',
    },
    {
      name: 'languages',
      title: 'Languages',
      description: 'Comma-separated, e.g., "English, French, Spanish"',
      type: 'string',
    },
    {
      name: 'skills',
      title: 'Skills',
      description: 'Comma-separated, e.g., "Dance, Singing, Martial Arts"',
      type: 'string',
    },
    {
      name: 'showreelVideo',
      title: 'Showreel Video',
      description: 'Main showreel video',
      type: 'file',
      options: {
        accept: 'video/*',
      },
    },
    {
      name: 'showreelImage',
      title: 'Showreel Section - Cover Image',
      description: 'Image shown in the "SHOWREEL" section',
      type: 'image',
      options: {
        hotspot: true,
      },
    },
    {
      name: 'reelsGallery',
      title: 'Reels Gallery',
      description: 'Collection of video reels (shown when clicking "VIEW REELS")',
      type: 'array',
      of: [
        {
          type: 'file',
          options: {
            accept: 'video/*',
          },
        },
      ],
    },
    {
      name: 'credits',
      title: 'Credits',
      description: 'List of films, commercials, or theater productions',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'title',
              title: 'Production Title',
              type: 'string',
            },
            {
              name: 'role',
              title: 'Role',
              type: 'string',
            },
            {
              name: 'year',
              title: 'Year',
              type: 'string',
            },
            {
              name: 'type',
              title: 'Type',
              type: 'string',
              options: {
                list: ['Film', 'Commercial', 'Theater', 'TV Series'],
              },
            },
          ],
        },
      ],
    },
    {
      name: 'creditsImage',
      title: 'Credits Section - Cover Image',
      description: 'Image shown in the "CREDITS" section',
      type: 'image',
      options: {
        hotspot: true,
      },
    },
    {
      name: 'instagramImage',
      title: 'Social (Instagram) - Main Image',
      description: 'Image shown in the "SOCIAL" section',
      type: 'image',
      options: {
        hotspot: true,
      },
    },
    {
      name: 'instagramUrl',
      title: 'Instagram URL',
      description: 'Link to the actor\'s Instagram profile',
      type: 'url',
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
      subtitle: 'category',
    },
  },
}

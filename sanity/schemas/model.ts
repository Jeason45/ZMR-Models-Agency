export default {
  name: 'model',
  title: 'Model',
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
          { title: 'Woman', value: 'woman' },
          { title: 'Man', value: 'man' },
        ],
        layout: 'radio',
      },
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
      description: 'Video shown at the top of the model page. If not provided, the main image will be used.',
      type: 'file',
      options: {
        accept: 'video/*',
      },
    },
    {
      name: 'galleryImages',
      title: 'Gallery Images',
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
      name: 'height',
      title: 'Height',
      type: 'string',
    },
    {
      name: 'neck',
      title: 'Neck',
      type: 'string',
    },
    {
      name: 'bust',
      title: 'Bust',
      type: 'string',
    },
    {
      name: 'chest',
      title: 'Chest',
      type: 'string',
    },
    {
      name: 'waist',
      title: 'Waist',
      type: 'string',
    },
    {
      name: 'hips',
      title: 'Hips',
      type: 'string',
    },
    {
      name: 'suit',
      title: 'Suit',
      type: 'string',
    },
    {
      name: 'inseam',
      title: 'Inseam',
      type: 'string',
    },
    {
      name: 'shoes',
      title: 'Shoes',
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

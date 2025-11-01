export default {
  name: 'detail',
  title: 'Detail',
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
          { title: 'Hands', value: 'hands' },
          { title: 'Face', value: 'face' },
          { title: 'Feet', value: 'feet' },
          { title: 'Legs', value: 'legs' },
          { title: 'Body', value: 'body' },
          { title: 'Hair', value: 'hair' },
          { title: 'Torso', value: 'torso' },
          { title: 'Others', value: 'others' },
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
      title: 'Main Image (Close-up)',
      description: 'Close-up photo of the specific body part',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'hoverImage',
      title: 'Hover Image (Close-up)',
      description: 'Alternative close-up for hover effect',
      type: 'image',
      options: {
        hotspot: true,
      },
    },
    {
      name: 'heroImage',
      title: 'Hero Image',
      description: 'Artistic close-up shown at the top of the detail page',
      type: 'image',
      options: {
        hotspot: true,
      },
    },
    {
      name: 'handSize',
      title: 'Hand Size',
      description: 'e.g., "7 inches"',
      type: 'string',
    },
    {
      name: 'ringSize',
      title: 'Ring Size',
      description: 'e.g., "6.5"',
      type: 'string',
    },
    {
      name: 'wristSize',
      title: 'Wrist Size',
      description: 'e.g., "6 inches"',
      type: 'string',
    },
    {
      name: 'footSize',
      title: 'Foot Size / Shoe Size',
      description: 'e.g., "8.5 US"',
      type: 'string',
    },
    {
      name: 'legLength',
      title: 'Leg Length',
      description: 'e.g., "34 inches"',
      type: 'string',
    },
    {
      name: 'neckSize',
      title: 'Neck Size',
      description: 'e.g., "14 inches"',
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
      name: 'bust',
      title: 'Bust',
      type: 'string',
    },
    {
      name: 'height',
      title: 'Height',
      type: 'string',
    },
    {
      name: 'portfolioGallery',
      title: 'Portfolio Gallery',
      description: 'Gallery of campaign close-ups',
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
      name: 'portfolioImage',
      title: 'Portfolio Section - Cover Image',
      description: 'Image shown in the "PORTFOLIO" section',
      type: 'image',
      options: {
        hotspot: true,
      },
    },
    {
      name: 'campaigns',
      title: 'Campaigns',
      description: 'List of brands/campaigns they have worked on',
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
      name: 'campaignsImage',
      title: 'Campaigns Section - Cover Image',
      description: 'Image shown in the "CAMPAIGNS" section',
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
      type: 'url',
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
    {
      name: 'skinTone',
      title: 'Skin Tone',
      type: 'string',
    },
    {
      name: 'faceSpecialty',
      title: 'Face Specialty',
      description: 'For face models, specify the specialty (lips, eyes, teeth, skin)',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Lips', value: 'lips' },
          { title: 'Eyes', value: 'eyes' },
          { title: 'Teeth/Smile', value: 'teeth' },
          { title: 'Skin', value: 'skin' },
        ],
        layout: 'checkbox',
      },
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

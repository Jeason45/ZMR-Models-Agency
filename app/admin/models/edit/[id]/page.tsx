'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import AdminSidebar from '@/components/AdminSidebar';
import { useSidebar } from '@/components/SidebarContext';
import imageCompression from 'browser-image-compression';

export default function EditModelPage() {
  const router = useRouter();
  const params = useParams();
  const modelId = params.id as string;
  const { sidebarWidth } = useSidebar();
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [currentStep, setCurrentStep] = useState(0); // Start at 0 for type selection

  // Form data
  const [formData, setFormData] = useState({
    // Type de talent (principal pour rétrocompatibilité)
    type: 'MODELS' as 'MODELS' | 'ACTING' | 'PROMO' | 'DETAILS',

    // Types multiples (nouveau système)
    types: ['MODELS'] as ('MODELS' | 'ACTING' | 'PROMO' | 'DETAILS')[],

    // Infos de base
    name: '',
    category: 'woman',
    status: 'active',

    // Images communes
    mainImage: null as File | null,
    hoverImage: null as File | null,
    heroVideo: null as File | null,
    heroImage: null as File | null,
    galleryImages: [] as File[],

    // Position des images dans les cards (0-100%)
    mainImagePositionX: 50,
    mainImagePositionY: 20,
    hoverImagePositionX: 50,
    hoverImagePositionY: 20,

    // Positions de toutes les images pour les sections du site (JSON)
    imagePositions: {
      heroImage: { x: 50, y: 50 },
      portfolioImage: { x: 50, y: 50 },
      showsImage: { x: 50, y: 50 },
      instagramImage: { x: 50, y: 50 },
      socialImage: { x: 50, y: 50 },
      showreelImage: { x: 50, y: 50 },
      creditsImage: { x: 50, y: 50 },
      collaborationsImage: { x: 50, y: 50 },
      eventsImage: { x: 50, y: 50 },
      campaignsImage: { x: 50, y: 50 },
    } as Record<string, { x: number; y: number }>,

    // Instagram (commun)
    instagramImage: null as File | null,
    instagramUrl: '',

    // Mensurations communes
    height: '',
    eyes: '',
    hair: '',

    // MODELS specific
    portfolioImage: null as File | null,
    portfolioGallery: [] as File[],
    showsImage: null as File | null,
    showsVideo: null as File | null,
    neck: '',
    bust: '',
    chest: '',
    waist: '',
    hips: '',
    suit: '',
    inseam: '',
    shoes: '',

    // ACTING specific
    showreelVideo: null as File | null,
    showreelImage: null as File | null,
    reelsGallery: [] as File[],
    creditsImage: null as File | null,
    credits: [] as any[],
    ageRange: '',
    languages: '',
    skills: '',

    // PROMO specific
    collaborationsImage: null as File | null,
    collaborations: [] as any[],
    eventsGallery: [] as File[],
    eventsImage: null as File | null,
    socialImage: null as File | null,
    instagramFollowers: '',
    tiktokFollowers: '',
    tiktokUrl: '',
    promoCategories: [] as string[],

    // DETAILS specific
    campaigns: [] as any[],
    campaignsImage: null as File | null,
    handSize: '',
    ringSize: '',
    wristSize: '',
    footSize: '',
    legLength: '',
    neckSize: '',
    skinTone: '',
    faceSpecialty: '',

    // Experiences (shows, credits, collabs, campaigns)
    experiences: [] as {
      id: string;
      title: string;
      type: 'show' | 'credit' | 'collab' | 'campaign';
      description?: string;
      brand?: string;
      role?: string;
      year?: string;
      images: string[];
      imagePosition?: { x: number; y: number };
      video?: string;
      order: number;
    }[],
  });

  // Preview URLs for images
  const [previews, setPreviews] = useState<{[key: string]: string}>({});

  // Stocker les URLs existantes (pour ne pas les re-uploader)
  const [existingImages, setExistingImages] = useState<{ [key: string]: string | string[] }>({});

  // Modal d'édition d'expérience
  const [experienceModal, setExperienceModal] = useState<{
    isOpen: boolean;
    editingIndex: number | null; // null = nouvelle expérience
    data: {
      id: string;
      title: string;
      type: 'show' | 'credit' | 'collab' | 'campaign';
      description: string;
      brand: string;
      role: string;
      year: string;
      images: (string | File)[]; // URLs existantes ou nouveaux fichiers
      imagePosition: { x: number; y: number };
      video: string | File | null;
    };
  }>({
    isOpen: false,
    editingIndex: null,
    data: {
      id: '',
      title: '',
      type: 'show',
      description: '',
      brand: '',
      role: '',
      year: '',
      images: [],
      imagePosition: { x: 50, y: 50 },
      video: null,
    },
  });

  // Charger les données du model
  useEffect(() => {
    const fetchModelData = async () => {
      try {
        const response = await fetch(`/api/talents/${modelId}`);
        if (!response.ok) {
          throw new Error('Model not found');
        }
        const model = await response.json();

        // Remplir le formulaire avec les données existantes
        setFormData({
          type: model.type || 'MODELS',
          // Types multiples - Si pas défini, utiliser le type principal
          types: model.types && Array.isArray(model.types) && model.types.length > 0
            ? model.types
            : [model.type || 'MODELS'],
          name: model.name || '',
          category: model.category || 'woman',
          status: model.status || 'active',

          // Images communes
          mainImage: null,
          hoverImage: null,
          heroVideo: null,
          heroImage: null,
          galleryImages: [],

          // Position des images dans les cards
          mainImagePositionX: model.mainImagePositionX ?? 50,
          mainImagePositionY: model.mainImagePositionY ?? 20,
          hoverImagePositionX: model.hoverImagePositionX ?? 50,
          hoverImagePositionY: model.hoverImagePositionY ?? 20,

          // Positions de toutes les images des sections (depuis DB ou défaut)
          imagePositions: model.imagePositions || {
            heroImage: { x: 50, y: 50 },
            portfolioImage: { x: 50, y: 50 },
            showsImage: { x: 50, y: 50 },
            instagramImage: { x: 50, y: 50 },
            socialImage: { x: 50, y: 50 },
            showreelImage: { x: 50, y: 50 },
            creditsImage: { x: 50, y: 50 },
            collaborationsImage: { x: 50, y: 50 },
            eventsImage: { x: 50, y: 50 },
            campaignsImage: { x: 50, y: 50 },
          },

          // Instagram
          instagramImage: null,
          instagramUrl: model.instagramUrl || '',

          // Mensurations communes
          height: model.height || '',
          eyes: model.eyes || '',
          hair: model.hair || '',

          // MODELS specific
          portfolioImage: null,
          portfolioGallery: [],
          showsImage: null,
          showsVideo: null,
          neck: model.neck || '',
          bust: model.bust || '',
          chest: model.chest || '',
          waist: model.waist || '',
          hips: model.hips || '',
          suit: model.suit || '',
          inseam: model.inseam || '',
          shoes: model.shoes || '',

          // ACTING specific
          showreelVideo: null,
          showreelImage: null,
          reelsGallery: [],
          creditsImage: null,
          credits: model.credits || [],
          ageRange: model.ageRange || '',
          languages: Array.isArray(model.languages) ? model.languages.join(', ') : '',
          skills: Array.isArray(model.skills) ? model.skills.join(', ') : '',

          // PROMO specific
          collaborationsImage: null,
          collaborations: model.collaborations || [],
          eventsGallery: [],
          eventsImage: null,
          socialImage: null,
          instagramFollowers: model.instagramFollowers || '',
          tiktokFollowers: model.tiktokFollowers || '',
          tiktokUrl: model.tiktokUrl || '',
          promoCategories: model.promoCategories || [],

          // DETAILS specific
          campaigns: model.campaigns || [],
          campaignsImage: null,
          handSize: model.handSize || '',
          ringSize: model.ringSize || '',
          wristSize: model.wristSize || '',
          footSize: model.footSize || '',
          legLength: model.legLength || '',
          neckSize: model.neckSize || '',
          skinTone: model.skinTone || '',
          faceSpecialty: Array.isArray(model.faceSpecialty) ? model.faceSpecialty.join(', ') : '',

          // Experiences
          experiences: model.experiences || [],
        });

        // Stocker les URLs existantes
        const existing: any = {};

        // Images communes
        if (model.mainImage) {
          existing.mainImage = model.mainImage;
          setPreviews(prev => ({ ...prev, mainImage: model.mainImage }));
        }
        if (model.hoverImage) {
          existing.hoverImage = model.hoverImage;
          setPreviews(prev => ({ ...prev, hoverImage: model.hoverImage }));
        }
        if (model.heroVideo) existing.heroVideo = model.heroVideo;
        if (model.heroImage) {
          existing.heroImage = model.heroImage;
          setPreviews(prev => ({ ...prev, heroImage: model.heroImage }));
        }
        if (model.instagramImage) {
          existing.instagramImage = model.instagramImage;
          setPreviews(prev => ({ ...prev, instagramImage: model.instagramImage }));
        }
        if (model.galleryImages && Array.isArray(model.galleryImages)) {
          existing.galleryImages = model.galleryImages;
          model.galleryImages.forEach((url: string, index: number) => {
            setPreviews(prev => ({ ...prev, [`galleryImages_${index}`]: url }));
          });
        }

        // MODELS specific
        if (model.portfolioImage) {
          existing.portfolioImage = model.portfolioImage;
          setPreviews(prev => ({ ...prev, portfolioImage: model.portfolioImage }));
        }
        if (model.portfolioGallery && Array.isArray(model.portfolioGallery)) {
          existing.portfolioGallery = model.portfolioGallery;
          model.portfolioGallery.forEach((url: string, index: number) => {
            setPreviews(prev => ({ ...prev, [`portfolioGallery_${index}`]: url }));
          });
        }
        if (model.showsImage) {
          existing.showsImage = model.showsImage;
          setPreviews(prev => ({ ...prev, showsImage: model.showsImage }));
        }
        if (model.showsVideo) existing.showsVideo = model.showsVideo;

        // ACTING specific
        if (model.showreelVideo) existing.showreelVideo = model.showreelVideo;
        if (model.showreelImage) {
          existing.showreelImage = model.showreelImage;
          setPreviews(prev => ({ ...prev, showreelImage: model.showreelImage }));
        }
        if (model.creditsImage) {
          existing.creditsImage = model.creditsImage;
          setPreviews(prev => ({ ...prev, creditsImage: model.creditsImage }));
        }
        if (model.reelsGallery && Array.isArray(model.reelsGallery)) {
          existing.reelsGallery = model.reelsGallery;
        }

        // PROMO specific
        if (model.portfolioImage) {
          existing.portfolioImage = model.portfolioImage;
          setPreviews(prev => ({ ...prev, portfolioImage: model.portfolioImage }));
        }
        if (model.showsImage) {
          existing.showsImage = model.showsImage;
          setPreviews(prev => ({ ...prev, showsImage: model.showsImage }));
        }
        if (model.showsVideo) existing.showsVideo = model.showsVideo;
        if (model.collaborationsImage) {
          existing.collaborationsImage = model.collaborationsImage;
          setPreviews(prev => ({ ...prev, collaborationsImage: model.collaborationsImage }));
        }
        if (model.eventsImage) {
          existing.eventsImage = model.eventsImage;
          setPreviews(prev => ({ ...prev, eventsImage: model.eventsImage }));
        }
        if (model.socialImage) {
          existing.socialImage = model.socialImage;
          setPreviews(prev => ({ ...prev, socialImage: model.socialImage }));
        }
        if (model.eventsGallery && Array.isArray(model.eventsGallery)) {
          existing.eventsGallery = model.eventsGallery;
          model.eventsGallery.forEach((url: string, index: number) => {
            setPreviews(prev => ({ ...prev, [`eventsGallery_${index}`]: url }));
          });
        }

        // DETAILS specific
        if (model.campaignsImage) {
          existing.campaignsImage = model.campaignsImage;
          setPreviews(prev => ({ ...prev, campaignsImage: model.campaignsImage }));
        }

        setExistingImages(existing);
      } catch (error) {
        console.error('Error loading model:', error);
        alert('Erreur lors du chargement du model');
        router.push('/admin/models');
      } finally {
        setLoadingData(false);
      }
    };

    fetchModelData();
  }, [modelId, router]);

  const handleFileChange = (field: string, file: File | null) => {
    setFormData(prev => ({ ...prev, [field]: file }));

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviews(prev => ({ ...prev, [field]: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeFile = (field: string) => {
    setFormData(prev => ({ ...prev, [field]: null }));
    setPreviews(prev => {
      const newPreviews = { ...prev };
      delete newPreviews[field];
      return newPreviews;
    });
    // Également supprimer de existingImages pour indiquer que l'image a été supprimée
    setExistingImages(prev => {
      const newExisting = { ...prev };
      delete newExisting[field];
      return newExisting;
    });
  };

  const handleGalleryChange = (field: string, files: FileList) => {
    const fileArray = Array.from(files);
    setFormData(prev => ({ ...prev, [field]: fileArray }));

    // Create previews for all images
    fileArray.forEach((file, index) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviews(prev => ({ ...prev, [`${field}_${index}`]: reader.result as string }));
      };
      reader.readAsDataURL(file);
    });
  };

  const removeGalleryImage = (field: string, index: number) => {
    setFormData(prev => {
      const fieldArray = prev[field as keyof typeof prev] as File[];
      const newArray = fieldArray.filter((_, i) => i !== index);
      return { ...prev, [field]: newArray };
    });

    setPreviews(prev => {
      const newPreviews = { ...prev };
      delete newPreviews[`${field}_${index}`];
      // Reindex remaining previews
      const fieldArray = formData[field as keyof typeof formData] as File[];
      fieldArray.forEach((_, i) => {
        if (i > index && newPreviews[`${field}_${i}`]) {
          newPreviews[`${field}_${i - 1}`] = newPreviews[`${field}_${i}`];
          delete newPreviews[`${field}_${i}`];
        }
      });
      return newPreviews;
    });
  };

  // Fonction helper pour mettre à jour imagePositions
  const updateImagePosition = (imageKey: string, x: number, y: number) => {
    setFormData(prev => ({
      ...prev,
      imagePositions: {
        ...prev.imagePositions,
        [imageKey]: { x, y }
      }
    }));
  };

  // Composant réutilisable pour drag & drop sur une card (comme sur le site)
  const DraggableImageCard = ({
    imageKey,
    previewUrl,
    label,
    aspectRatio = '16/9',
    width = '100%',
    color = '#6366f1',
    sectionName,
  }: {
    imageKey: string;
    previewUrl: string;
    label: string;
    aspectRatio?: string;
    width?: string;
    color?: string;
    sectionName?: string;
  }) => {
    const position = formData.imagePositions[imageKey] || { x: 50, y: 50 };

    return (
      <div style={{
        padding: '16px',
        backgroundColor: 'white',
        borderRadius: '8px',
        border: `1px solid ${color}30`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <p style={{ fontSize: '13px', fontWeight: 600, color: '#475569' }}>{label}</p>
          {sectionName && (
            <span style={{ padding: '2px 8px', backgroundColor: `${color}15`, color: color, fontSize: '10px', fontWeight: 600, borderRadius: '4px', textTransform: 'uppercase' }}>
              {sectionName}
            </span>
          )}
        </div>

        <div
          style={{
            width: width,
            maxWidth: '400px',
            aspectRatio: aspectRatio,
            borderRadius: '8px',
            overflow: 'hidden',
            border: '2px solid #e2e8f0',
            cursor: 'grab',
            position: 'relative',
            margin: '0 auto',
            userSelect: 'none',
            backgroundColor: '#111',
          }}
          onMouseDown={(e) => {
            e.preventDefault();
            const container = e.currentTarget;
            container.style.cursor = 'grabbing';
            const startX = e.clientX;
            const startY = e.clientY;
            const startPosX = position.x;
            const startPosY = position.y;

            const onMouseMove = (moveEvent: MouseEvent) => {
              const deltaX = (moveEvent.clientX - startX) / container.offsetWidth * -100;
              const deltaY = (moveEvent.clientY - startY) / container.offsetHeight * -100;
              const newX = Math.max(0, Math.min(100, startPosX + deltaX));
              const newY = Math.max(0, Math.min(100, startPosY + deltaY));
              updateImagePosition(imageKey, Math.round(newX), Math.round(newY));
            };

            const onMouseUp = () => {
              container.style.cursor = 'grab';
              document.removeEventListener('mousemove', onMouseMove);
              document.removeEventListener('mouseup', onMouseUp);
            };

            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
          }}
        >
          <img
            src={previewUrl}
            alt="Preview position"
            draggable={false}
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: `${position.x}% ${position.y}%`, pointerEvents: 'none' }}
          />
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: `${color}cc`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M5 9l-3 3 3 3M9 5l3-3 3 3M15 19l-3 3-3-3M19 9l3 3-3 3M2 12h20M12 2v20"/></svg>
            </div>
          </div>
          {sectionName && (
            <div style={{ position: 'absolute', bottom: '16px', left: '0', width: '100%', textAlign: 'center' }}>
              <h3 style={{ color: 'white', fontSize: '18px', fontWeight: 900, letterSpacing: '0.05em', textTransform: 'uppercase', textShadow: '2px 2px 8px rgba(0,0,0,0.5)', margin: 0 }}>
                {sectionName}
              </h3>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '12px' }}>
          <p style={{ fontSize: '11px', color: '#94a3b8' }}>Position: {position.x}% / {position.y}%</p>
          <button type="button" onClick={() => updateImagePosition(imageKey, 50, 50)} style={{ padding: '4px 12px', fontSize: '11px', color: '#64748b', backgroundColor: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: '4px', cursor: 'pointer' }}>
            Centrer
          </button>
        </div>
      </div>
    );
  };

  const uploadFile = async (file: File, type: 'image' | 'video'): Promise<string> => {
    // Validation côté client pour éviter les erreurs
    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');

    if (type === 'image' && !isImage) {
      console.error(`Tentative d'upload d'une vidéo dans un champ image:`, { name: file.name, type: file.type });
      throw new Error(`Le fichier "${file.name}" n'est pas une image. Type: ${file.type}`);
    }

    if (type === 'video' && !isVideo) {
      console.error(`Tentative d'upload d'une image dans un champ vidéo:`, { name: file.name, type: file.type });
      throw new Error(`Le fichier "${file.name}" n'est pas une vidéo. Type: ${file.type}`);
    }

    let fileToUpload = file;

    // Compresser les images avant l'upload
    if (type === 'image') {
      const options = {
        maxSizeMB: 2, // Taille max 2MB
        maxWidthOrHeight: 1920, // Dimension max
        useWebWorker: true,
        fileType: file.type,
      };
      console.log('Compression de l\'image...', file.size / 1024 / 1024, 'MB');
      fileToUpload = await imageCompression(file, options);
      console.log('Image compressée:', fileToUpload.size / 1024 / 1024, 'MB');
    }

    // Upload via le serveur (évite les problèmes CORS)
    const formData = new FormData();
    formData.append('file', fileToUpload);
    formData.append('type', type);
    formData.append('category', 'models');

    const uploadResponse = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (!uploadResponse.ok) {
      throw new Error('Upload failed');
    }

    const { filePath } = await uploadResponse.json();
    console.log(`✓ ${type} uploadé vers R2:`, filePath);
    return filePath;
  };

  // ===== GESTION DU MODAL EXPERIENCE =====
  const openExperienceModal = (index: number | null = null) => {
    if (index !== null && formData.experiences?.[index]) {
      // Édition d'une expérience existante
      const exp = formData.experiences[index];
      setExperienceModal({
        isOpen: true,
        editingIndex: index,
        data: {
          id: exp.id,
          title: exp.title,
          type: exp.type,
          description: exp.description || '',
          brand: exp.brand || '',
          role: exp.role || '',
          year: exp.year || '',
          images: exp.images || [],
          imagePosition: exp.imagePosition || { x: 50, y: 50 },
          video: exp.video || null,
        },
      });
    } else {
      // Nouvelle expérience
      setExperienceModal({
        isOpen: true,
        editingIndex: null,
        data: {
          id: `exp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          title: '',
          type: 'show',
          description: '',
          brand: '',
          role: '',
          year: '',
          images: [],
          imagePosition: { x: 50, y: 50 },
          video: null,
        },
      });
    }
  };

  const closeExperienceModal = () => {
    setExperienceModal(prev => ({ ...prev, isOpen: false }));
  };

  const updateExperienceModalData = (field: string, value: any) => {
    setExperienceModal(prev => ({
      ...prev,
      data: { ...prev.data, [field]: value },
    }));
  };

  const handleExperienceImageUpload = (files: FileList | null) => {
    if (!files) return;
    const newImages = [...experienceModal.data.images, ...Array.from(files)];
    updateExperienceModalData('images', newImages);
  };

  const removeExperienceImage = (index: number) => {
    const newImages = experienceModal.data.images.filter((_, i) => i !== index);
    updateExperienceModalData('images', newImages);
  };

  const saveExperience = async () => {
    const { data, editingIndex } = experienceModal;

    if (!data.title.trim()) {
      alert('Le titre est obligatoire');
      return;
    }

    // Préparer les images (upload les fichiers, garder les URLs existantes)
    const uploadedImages: string[] = [];
    for (const img of data.images) {
      if (typeof img === 'string') {
        // URL existante
        uploadedImages.push(img);
      } else {
        // Nouveau fichier - upload
        try {
          const url = await uploadFile(img, 'image');
          uploadedImages.push(url);
        } catch (error) {
          console.error('Erreur upload image:', error);
        }
      }
    }

    // Préparer la vidéo
    let videoUrl: string | undefined = undefined;
    if (data.video) {
      if (typeof data.video === 'string') {
        videoUrl = data.video;
      } else {
        try {
          videoUrl = await uploadFile(data.video, 'video');
        } catch (error) {
          console.error('Erreur upload vidéo:', error);
        }
      }
    }

    const experienceData = {
      id: data.id,
      title: data.title.trim(),
      type: data.type,
      description: data.description.trim() || undefined,
      brand: data.brand.trim() || undefined,
      role: data.role.trim() || undefined,
      year: data.year.trim() || undefined,
      images: uploadedImages,
      imagePosition: data.imagePosition,
      video: videoUrl,
      order: editingIndex !== null ? editingIndex : (formData.experiences?.length || 0),
    };

    if (editingIndex !== null) {
      // Mise à jour
      const newExperiences = [...(formData.experiences || [])];
      newExperiences[editingIndex] = experienceData;
      setFormData(prev => ({ ...prev, experiences: newExperiences }));
    } else {
      // Nouvelle
      setFormData(prev => ({ ...prev, experiences: [...(prev.experiences || []), experienceData] }));
    }

    closeExperienceModal();
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Ne soumettre que si on est à l'étape 6 (measurements - dernière étape)
    if (currentStep !== 6) {
      return;
    }

    setLoading(true);

    try {
      // Upload all files first
      const uploadedData: any = {
        type: formData.type,
        name: formData.name,
        category: formData.category,
        status: formData.status,
        instagramUrl: formData.instagramUrl,

        // Multi-types (nouveau système)
        types: formData.types,

        // Positions des images dans les cards
        mainImagePositionX: formData.mainImagePositionX,
        mainImagePositionY: formData.mainImagePositionY,
        hoverImagePositionX: formData.hoverImagePositionX,
        hoverImagePositionY: formData.hoverImagePositionY,

        // Positions de toutes les images des sections (JSON)
        imagePositions: formData.imagePositions,

        // Common fields for all types
        height: formData.height,
        eyes: formData.eyes,
        hair: formData.hair,
      };

      // Upload common images
      if (formData.mainImage) {
        uploadedData.mainImage = await uploadFile(formData.mainImage, 'image');
      } else if (existingImages.mainImage) {
        uploadedData.mainImage = existingImages.mainImage;
      }

      if (formData.hoverImage) {
        uploadedData.hoverImage = await uploadFile(formData.hoverImage, 'image');
      } else if (existingImages.hoverImage) {
        uploadedData.hoverImage = existingImages.hoverImage;
      }

      if (formData.heroVideo) {
        uploadedData.heroVideo = await uploadFile(formData.heroVideo, 'video');
      } else if (existingImages.heroVideo) {
        uploadedData.heroVideo = existingImages.heroVideo;
      }

      if (formData.heroImage) {
        uploadedData.heroImage = await uploadFile(formData.heroImage, 'image');
      } else if (existingImages.heroImage) {
        uploadedData.heroImage = existingImages.heroImage;
      }

      if (formData.instagramImage) {
        uploadedData.instagramImage = await uploadFile(formData.instagramImage, 'image');
      } else if (existingImages.instagramImage) {
        uploadedData.instagramImage = existingImages.instagramImage;
      }

      // Upload common gallery
      if (formData.galleryImages.length > 0) {
        const galleryPaths = await Promise.all(
          formData.galleryImages.map(file => uploadFile(file, 'image'))
        );
        uploadedData.galleryImages = galleryPaths;
      } else if (existingImages.galleryImages) {
        uploadedData.galleryImages = existingImages.galleryImages;
      }

      // MODELS specific fields
      if (formData.type === 'MODELS') {
        uploadedData.neck = formData.neck;
        uploadedData.bust = formData.bust;
        uploadedData.chest = formData.chest;
        uploadedData.waist = formData.waist;
        uploadedData.hips = formData.hips;
        uploadedData.suit = formData.suit;
        uploadedData.inseam = formData.inseam;
        uploadedData.shoes = formData.shoes;

        if (formData.portfolioImage) {
          uploadedData.portfolioImage = await uploadFile(formData.portfolioImage, 'image');
        } else if (existingImages.portfolioImage) {
          uploadedData.portfolioImage = existingImages.portfolioImage;
        }

        if (formData.showsImage) {
          uploadedData.showsImage = await uploadFile(formData.showsImage, 'image');
        } else if (existingImages.showsImage) {
          uploadedData.showsImage = existingImages.showsImage;
        }

        if (formData.showsVideo) {
          uploadedData.showsVideo = await uploadFile(formData.showsVideo, 'video');
        } else if (existingImages.showsVideo) {
          uploadedData.showsVideo = existingImages.showsVideo;
        }

        if (formData.portfolioGallery.length > 0) {
          const portfolioPaths = await Promise.all(
            formData.portfolioGallery.map(file => uploadFile(file, 'image'))
          );
          uploadedData.portfolioGallery = portfolioPaths;
        } else if (existingImages.portfolioGallery) {
          uploadedData.portfolioGallery = existingImages.portfolioGallery;
        }
      }

      // ACTING specific fields
      if (formData.type === 'ACTING') {
        uploadedData.ageRange = formData.ageRange;
        uploadedData.languages = formData.languages ? formData.languages.split(',').map((l: string) => l.trim()) : [];
        uploadedData.skills = formData.skills ? formData.skills.split(',').map((s: string) => s.trim()) : [];
        uploadedData.credits = formData.credits;

        if (formData.showreelImage) {
          uploadedData.showreelImage = await uploadFile(formData.showreelImage, 'image');
        } else if (existingImages.showreelImage) {
          uploadedData.showreelImage = existingImages.showreelImage;
        }

        if (formData.showreelVideo) {
          uploadedData.showreelVideo = await uploadFile(formData.showreelVideo, 'video');
        } else if (existingImages.showreelVideo) {
          uploadedData.showreelVideo = existingImages.showreelVideo;
        }

        if (formData.creditsImage) {
          uploadedData.creditsImage = await uploadFile(formData.creditsImage, 'image');
        } else if (existingImages.creditsImage) {
          uploadedData.creditsImage = existingImages.creditsImage;
        }

        if (formData.reelsGallery.length > 0) {
          const reelsPaths = await Promise.all(
            formData.reelsGallery.map(file => uploadFile(file, 'video'))
          );
          uploadedData.reelsGallery = reelsPaths;
        } else if (existingImages.reelsGallery) {
          uploadedData.reelsGallery = existingImages.reelsGallery;
        }
      }

      // PROMO specific fields
      if (formData.type === 'PROMO') {
        uploadedData.instagramFollowers = formData.instagramFollowers;
        uploadedData.tiktokUrl = formData.tiktokUrl;
        uploadedData.tiktokFollowers = formData.tiktokFollowers;
        uploadedData.promoCategories = formData.promoCategories;

        if (formData.portfolioImage) {
          uploadedData.portfolioImage = await uploadFile(formData.portfolioImage, 'image');
        } else if (existingImages.portfolioImage) {
          uploadedData.portfolioImage = existingImages.portfolioImage;
        }

        if (formData.showsImage) {
          uploadedData.showsImage = await uploadFile(formData.showsImage, 'image');
        } else if (existingImages.showsImage) {
          uploadedData.showsImage = existingImages.showsImage;
        }

        if (formData.showsVideo) {
          uploadedData.showsVideo = await uploadFile(formData.showsVideo, 'video');
        } else if (existingImages.showsVideo) {
          uploadedData.showsVideo = existingImages.showsVideo;
        }

        if (formData.collaborationsImage) {
          uploadedData.collaborationsImage = await uploadFile(formData.collaborationsImage, 'image');
        } else if (existingImages.collaborationsImage) {
          uploadedData.collaborationsImage = existingImages.collaborationsImage;
        }

        if (formData.eventsImage) {
          uploadedData.eventsImage = await uploadFile(formData.eventsImage, 'image');
        } else if (existingImages.eventsImage) {
          uploadedData.eventsImage = existingImages.eventsImage;
        }

        if (formData.socialImage) {
          uploadedData.socialImage = await uploadFile(formData.socialImage, 'image');
        } else if (existingImages.socialImage) {
          uploadedData.socialImage = existingImages.socialImage;
        }

        if (formData.eventsGallery.length > 0) {
          const eventsPaths = await Promise.all(
            formData.eventsGallery.map(file => uploadFile(file, 'image'))
          );
          uploadedData.eventsGallery = eventsPaths;
        } else if (existingImages.eventsGallery) {
          uploadedData.eventsGallery = existingImages.eventsGallery;
        }
      }

      // DETAILS specific fields
      if (formData.type === 'DETAILS') {
        uploadedData.handSize = formData.handSize;
        uploadedData.ringSize = formData.ringSize;
        uploadedData.wristSize = formData.wristSize;
        uploadedData.footSize = formData.footSize;
        uploadedData.legLength = formData.legLength;
        uploadedData.neckSize = formData.neckSize;
        uploadedData.waist = formData.waist;
        uploadedData.hips = formData.hips;
        uploadedData.bust = formData.bust;
        uploadedData.skinTone = formData.skinTone;
        uploadedData.faceSpecialty = formData.faceSpecialty ? formData.faceSpecialty.split(',').map((f: string) => f.trim()) : [];
        uploadedData.campaigns = formData.campaigns;

        if (formData.portfolioImage) {
          uploadedData.portfolioImage = await uploadFile(formData.portfolioImage, 'image');
        } else if (existingImages.portfolioImage) {
          uploadedData.portfolioImage = existingImages.portfolioImage;
        }

        if (formData.campaignsImage) {
          uploadedData.campaignsImage = await uploadFile(formData.campaignsImage, 'image');
        } else if (existingImages.campaignsImage) {
          uploadedData.campaignsImage = existingImages.campaignsImage;
        }

        if (formData.portfolioGallery.length > 0) {
          const portfolioPaths = await Promise.all(
            formData.portfolioGallery.map(file => uploadFile(file, 'image'))
          );
          uploadedData.portfolioGallery = portfolioPaths;
        } else if (existingImages.portfolioGallery) {
          uploadedData.portfolioGallery = existingImages.portfolioGallery;
        }
      }

      // Experiences (commun à tous les types)
      if ((formData.experiences?.length || 0) > 0) {
        uploadedData.experiences = formData.experiences;
      }

      // Update model in database
      const response = await fetch(`/api/talents/${modelId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(uploadedData),
      });

      if (!response.ok) {
        throw new Error('Failed to update model');
      }

      const model = await response.json();
      alert('Model modifié avec succès !');
      router.push('/admin/models');
    } catch (error) {
      console.error('Error updating model:', error);
      alert('Erreur lors de la modification du model');
    } finally {
      setLoading(false);
    }
  };

  // Step 0: Sélection du type de talent (multi-types avec checkboxes)
  const renderStep0 = () => {
    const typeOptions = [
      { value: 'MODELS', label: 'Models', desc: 'Mannequins mode (Woman/Man)', color: '#6366f1' },
      { value: 'ACTING', label: 'Acting', desc: 'Acteurs (Commercial/Cinéma/Théâtre)', color: '#f59e0b' },
      { value: 'PROMO', label: 'Promo', desc: 'Ambassadeurs & Influenceurs', color: '#10b981' },
      { value: 'DETAILS', label: 'Details', desc: 'Modèles parties du corps', color: '#ec4899' },
    ];

    const toggleType = (typeValue: 'MODELS' | 'ACTING' | 'PROMO' | 'DETAILS') => {
      setFormData(prev => {
        const isSelected = prev.types.includes(typeValue);
        let newTypes: ('MODELS' | 'ACTING' | 'PROMO' | 'DETAILS')[];

        if (isSelected) {
          // Ne pas permettre de tout désélectionner
          if (prev.types.length === 1) return prev;
          newTypes = prev.types.filter(t => t !== typeValue);
        } else {
          newTypes = [...prev.types, typeValue];
        }

        // Le type principal est le premier de la liste
        const newPrimaryType = newTypes[0];

        // Reset category based on primary type
        let newCategory = prev.category;
        if (!isSelected && newTypes.length === 1) {
          newCategory = typeValue === 'MODELS' ? 'woman' :
                       typeValue === 'ACTING' ? 'commercial' :
                       typeValue === 'DETAILS' ? 'hands' : '';
        }

        return {
          ...prev,
          types: newTypes,
          type: newPrimaryType,
          category: newCategory
        };
      });
    };

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#0f172a', marginBottom: '8px' }}>
          Types de talent
        </h3>

        <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '16px' }}>
          Sélectionnez un ou plusieurs types pour ce talent (cochez toutes les cases applicables)
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
          {typeOptions.map((type) => {
            const isSelected = formData.types.includes(type.value as any);
            const isPrimary = formData.types[0] === type.value;

            return (
              <div
                key={type.value}
                onClick={() => toggleType(type.value as any)}
                style={{
                  padding: '20px',
                  border: isSelected ? `2px solid ${type.color}` : '2px solid #e2e8f0',
                  borderRadius: '12px',
                  background: isSelected ? `${type.color}10` : 'white',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s',
                  position: 'relative',
                }}
              >
                {/* Checkbox */}
                <div style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  width: '24px',
                  height: '24px',
                  borderRadius: '6px',
                  border: isSelected ? `2px solid ${type.color}` : '2px solid #cbd5e1',
                  backgroundColor: isSelected ? type.color : 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s',
                }}>
                  {isSelected && (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </div>

                {/* Primary badge */}
                {isPrimary && (
                  <span style={{
                    position: 'absolute',
                    top: '12px',
                    left: '12px',
                    padding: '2px 8px',
                    backgroundColor: type.color,
                    color: 'white',
                    fontSize: '10px',
                    fontWeight: 600,
                    borderRadius: '4px',
                    textTransform: 'uppercase',
                  }}>
                    Principal
                  </span>
                )}

                <div style={{
                  fontSize: '16px',
                  fontWeight: 600,
                  color: isSelected ? type.color : '#0f172a',
                  marginBottom: '8px',
                  marginTop: isPrimary ? '20px' : '0'
                }}>
                  {type.label}
                </div>
                <div style={{ fontSize: '13px', color: '#64748b' }}>
                  {type.desc}
                </div>
              </div>
            );
          })}
        </div>

        {/* Résumé des types sélectionnés */}
        <div style={{
          padding: '16px',
          backgroundColor: '#f8fafc',
          borderRadius: '8px',
          border: '1px solid #e2e8f0',
        }}>
          <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '8px' }}>
            Types sélectionnés :
          </p>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {formData.types.map((t, index) => {
              const typeInfo = typeOptions.find(opt => opt.value === t);
              return (
                <span
                  key={t}
                  style={{
                    padding: '4px 12px',
                    backgroundColor: typeInfo?.color || '#6366f1',
                    color: 'white',
                    fontSize: '12px',
                    fontWeight: 500,
                    borderRadius: '16px',
                  }}
                >
                  {index === 0 && '★ '}{typeInfo?.label || t}
                </span>
              );
            })}
          </div>
          <p style={{ fontSize: '11px', color: '#94a3b8', marginTop: '8px' }}>
            ★ = Type principal (utilisé pour la catégorie et les mensurations)
          </p>
        </div>
      </div>
    );
  };

  const renderStep1 = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#0f172a', marginBottom: '8px' }}>
        Informations de base
      </h3>

      <div>
        <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#475569', marginBottom: '8px' }}>
          Nom * <span style={{ color: '#ef4444' }}>requis</span>
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
            }
          }}
          required
          style={{
            width: '100%',
            padding: '10px 12px',
            border: '1px solid #e2e8f0',
            borderRadius: '6px',
            fontSize: '14px',
          }}
          placeholder="Ex: Marie Martin"
        />
      </div>

      <div>
        <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#475569', marginBottom: '8px' }}>
          Catégorie *
        </label>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          {/* Catégories MODELS */}
          {formData.type === 'MODELS' && (
            <>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="category"
                  value="woman"
                  checked={formData.category === 'woman'}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                />
                <span style={{ fontSize: '14px', color: '#475569' }}>Woman</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="category"
                  value="man"
                  checked={formData.category === 'man'}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                />
                <span style={{ fontSize: '14px', color: '#475569' }}>Man</span>
              </label>
            </>
          )}

          {/* Catégories ACTING */}
          {formData.type === 'ACTING' && (
            <>
              {['commercial', 'cinema', 'theater'].map(cat => (
                <label key={cat} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="category"
                    value={cat}
                    checked={formData.category === cat}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  />
                  <span style={{ fontSize: '14px', color: '#475569', textTransform: 'capitalize' }}>{cat}</span>
                </label>
              ))}
            </>
          )}

          {/* Catégories PROMO - Multiples (checkboxes) */}
          {formData.type === 'PROMO' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '4px' }}>
                Sélectionnez une ou plusieurs catégories:
              </div>
              {[
                { label: 'Beauty & Fashion', value: 'beauty-fashion' },
                { label: 'Luxury Events', value: 'luxury-events' },
                { label: 'Lifestyle', value: 'lifestyle' }
              ].map(cat => (
                <label key={cat.value} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    value={cat.value}
                    checked={(formData.category as string).split(',').includes(cat.value)}
                    onChange={(e) => {
                      const currentCategories = formData.category ? (formData.category as string).split(',').filter(c => c) : [];
                      if (e.target.checked) {
                        setFormData(prev => ({ ...prev, category: [...currentCategories, cat.value].join(',') }));
                      } else {
                        setFormData(prev => ({ ...prev, category: currentCategories.filter(c => c !== cat.value).join(',') }));
                      }
                    }}
                  />
                  <span style={{ fontSize: '14px', color: '#475569' }}>{cat.label}</span>
                </label>
              ))}
            </div>
          )}

          {/* Catégories DETAILS */}
          {formData.type === 'DETAILS' && (
            <>
              {['hands', 'face', 'feet', 'legs', 'body', 'hair', 'torso', 'others'].map(cat => (
                <label key={cat} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="category"
                    value={cat}
                    checked={formData.category === cat}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  />
                  <span style={{ fontSize: '14px', color: '#475569', textTransform: 'capitalize' }}>{cat}</span>
                </label>
              ))}
            </>
          )}
        </div>
      </div>

      <div>
        <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#475569', marginBottom: '8px' }}>
          Statut
        </label>
        <div style={{ display: 'flex', gap: '12px' }}>
          {['active', 'inactive', 'archived'].map(status => (
            <label key={status} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input
                type="radio"
                name="status"
                value={status}
                checked={formData.status === status}
                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
              />
              <span style={{ fontSize: '14px', color: '#475569', textTransform: 'capitalize' }}>{status}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => {
    // Helper pour créer un input d'upload avec preview et delete
    const ImageUploadField = ({
      fieldKey,
      label,
      required = false
    }: {
      fieldKey: string;
      label: string;
      required?: boolean;
    }) => (
      <div>
        <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#475569', marginBottom: '8px' }}>
          {label} {required && <span style={{ color: '#ef4444' }}>*</span>}
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => e.target.files && handleFileChange(fieldKey, e.target.files[0])}
          style={{
            width: '100%',
            padding: '10px 12px',
            border: '1px solid #e2e8f0',
            borderRadius: '6px',
            fontSize: '14px',
          }}
        />
        {(previews[fieldKey] || existingImages[fieldKey]) && (
          <div style={{ marginTop: '12px', position: 'relative', display: 'inline-block' }}>
            <img src={previews[fieldKey] || (existingImages[fieldKey] as string)} alt="Preview" style={{ maxWidth: '150px', borderRadius: '6px', display: 'block' }} />
            <button
              type="button"
              onClick={() => removeFile(fieldKey)}
              style={{
                position: 'absolute',
                top: '4px',
                right: '4px',
                backgroundColor: '#ef4444',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                padding: '4px 8px',
                fontSize: '10px',
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              X
            </button>
          </div>
        )}
      </div>
    );

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        {/* ===== SECTION 1: IMAGES POUR LES CARDS (LISTES) ===== */}
        <div style={{
          padding: '24px',
          backgroundColor: '#f8fafc',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <span style={{ padding: '4px 12px', backgroundColor: '#6366f1', color: 'white', fontSize: '11px', fontWeight: 600, borderRadius: '4px' }}>
              CARDS
            </span>
            <h4 style={{ fontSize: '15px', fontWeight: 600, color: '#0f172a', margin: 0 }}>
              Images pour les listes (All Models, etc.)
            </h4>
          </div>
          <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '20px' }}>
            Ces images s'affichent dans les grilles de tous les talents. Ratio 3/4 (portrait).
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
            <ImageUploadField fieldKey="mainImage" label="Image principale" required />
            <ImageUploadField fieldKey="hoverImage" label="Image au survol (hover)" />
          </div>

          {/* Drag & Drop pour Cards */}
          {(previews.mainImage || existingImages.mainImage || previews.hoverImage || existingImages.hoverImage) && (
            <div style={{ display: 'grid', gridTemplateColumns: (previews.mainImage || existingImages.mainImage) && (previews.hoverImage || existingImages.hoverImage) ? '1fr 1fr' : '1fr', gap: '20px' }}>
              {(previews.mainImage || existingImages.mainImage) && (
                <div style={{ padding: '16px', backgroundColor: 'white', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <p style={{ fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '12px', textAlign: 'center' }}>
                    Position: Card principale
                  </p>
                  <div
                    style={{
                      width: '140px',
                      aspectRatio: '3/4',
                      borderRadius: '6px',
                      overflow: 'hidden',
                      border: '2px solid #e2e8f0',
                      cursor: 'grab',
                      position: 'relative',
                      margin: '0 auto',
                      userSelect: 'none',
                      backgroundColor: '#111',
                    }}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      const container = e.currentTarget;
                      container.style.cursor = 'grabbing';
                      const startX = e.clientX;
                      const startY = e.clientY;
                      const startPosX = formData.mainImagePositionX;
                      const startPosY = formData.mainImagePositionY;
                      const onMouseMove = (moveEvent: MouseEvent) => {
                        const deltaX = (moveEvent.clientX - startX) / container.offsetWidth * -100;
                        const deltaY = (moveEvent.clientY - startY) / container.offsetHeight * -100;
                        const newX = Math.max(0, Math.min(100, startPosX + deltaX));
                        const newY = Math.max(0, Math.min(100, startPosY + deltaY));
                        setFormData(prev => ({ ...prev, mainImagePositionX: Math.round(newX), mainImagePositionY: Math.round(newY) }));
                      };
                      const onMouseUp = () => {
                        container.style.cursor = 'grab';
                        document.removeEventListener('mousemove', onMouseMove);
                        document.removeEventListener('mouseup', onMouseUp);
                      };
                      document.addEventListener('mousemove', onMouseMove);
                      document.addEventListener('mouseup', onMouseUp);
                    }}
                  >
                    <img src={previews.mainImage || (existingImages.mainImage as string)} alt="Main" draggable={false} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: `${formData.mainImagePositionX}% ${formData.mainImagePositionY}%`, pointerEvents: 'none' }} />
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'rgba(99,102,241,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M5 9l-3 3 3 3M9 5l3-3 3 3M15 19l-3 3-3-3M19 9l3 3-3 3M2 12h20M12 2v20"/></svg>
                      </div>
                    </div>
                  </div>
                  <p style={{ fontSize: '10px', color: '#94a3b8', textAlign: 'center', marginTop: '8px' }}>{formData.mainImagePositionX}% / {formData.mainImagePositionY}%</p>
                  <button type="button" onClick={() => setFormData(prev => ({ ...prev, mainImagePositionX: 50, mainImagePositionY: 20 }))} style={{ display: 'block', margin: '4px auto 0', padding: '4px 12px', fontSize: '10px', color: '#64748b', backgroundColor: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: '4px', cursor: 'pointer' }}>Centrer</button>
                </div>
              )}
              {(previews.hoverImage || existingImages.hoverImage) && (
                <div style={{ padding: '16px', backgroundColor: 'white', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <p style={{ fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '12px', textAlign: 'center' }}>
                    Position: Card hover
                  </p>
                  <div
                    style={{
                      width: '140px',
                      aspectRatio: '3/4',
                      borderRadius: '6px',
                      overflow: 'hidden',
                      border: '2px solid #e2e8f0',
                      cursor: 'grab',
                      position: 'relative',
                      margin: '0 auto',
                      userSelect: 'none',
                      backgroundColor: '#111',
                    }}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      const container = e.currentTarget;
                      container.style.cursor = 'grabbing';
                      const startX = e.clientX;
                      const startY = e.clientY;
                      const startPosX = formData.hoverImagePositionX;
                      const startPosY = formData.hoverImagePositionY;
                      const onMouseMove = (moveEvent: MouseEvent) => {
                        const deltaX = (moveEvent.clientX - startX) / container.offsetWidth * -100;
                        const deltaY = (moveEvent.clientY - startY) / container.offsetHeight * -100;
                        const newX = Math.max(0, Math.min(100, startPosX + deltaX));
                        const newY = Math.max(0, Math.min(100, startPosY + deltaY));
                        setFormData(prev => ({ ...prev, hoverImagePositionX: Math.round(newX), hoverImagePositionY: Math.round(newY) }));
                      };
                      const onMouseUp = () => {
                        container.style.cursor = 'grab';
                        document.removeEventListener('mousemove', onMouseMove);
                        document.removeEventListener('mouseup', onMouseUp);
                      };
                      document.addEventListener('mousemove', onMouseMove);
                      document.addEventListener('mouseup', onMouseUp);
                    }}
                  >
                    <img src={previews.hoverImage || (existingImages.hoverImage as string)} alt="Hover" draggable={false} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: `${formData.hoverImagePositionX}% ${formData.hoverImagePositionY}%`, pointerEvents: 'none' }} />
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'rgba(16,185,129,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M5 9l-3 3 3 3M9 5l3-3 3 3M15 19l-3 3-3-3M19 9l3 3-3 3M2 12h20M12 2v20"/></svg>
                      </div>
                    </div>
                  </div>
                  <p style={{ fontSize: '10px', color: '#94a3b8', textAlign: 'center', marginTop: '8px' }}>{formData.hoverImagePositionX}% / {formData.hoverImagePositionY}%</p>
                  <button type="button" onClick={() => setFormData(prev => ({ ...prev, hoverImagePositionX: 50, hoverImagePositionY: 20 }))} style={{ display: 'block', margin: '4px auto 0', padding: '4px 12px', fontSize: '10px', color: '#64748b', backgroundColor: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: '4px', cursor: 'pointer' }}>Centrer</button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ===== SECTION 2: HERO (pleine largeur sur le site) ===== */}
        <div style={{
          padding: '24px',
          backgroundColor: '#fef3c7',
          borderRadius: '12px',
          border: '1px solid #fbbf24',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <span style={{ padding: '4px 12px', backgroundColor: '#f59e0b', color: 'white', fontSize: '11px', fontWeight: 600, borderRadius: '4px' }}>
              HERO
            </span>
            <h4 style={{ fontSize: '15px', fontWeight: 600, color: '#0f172a', margin: 0 }}>
              Section Hero (pleine largeur sur le site)
            </h4>
          </div>
          <p style={{ fontSize: '13px', color: '#92400e', marginBottom: '20px' }}>
            Première section visible. Ratio 16/9 (paysage). Si vidéo fournie, elle remplace l'image.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
            <ImageUploadField fieldKey="heroImage" label="Image Hero" />
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#475569', marginBottom: '8px' }}>
                Vidéo Hero (prioritaire sur image)
              </label>
              <input
                type="file"
                accept="video/*"
                onChange={(e) => e.target.files && handleFileChange('heroVideo', e.target.files[0])}
                style={{ width: '100%', padding: '10px 12px', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '14px' }}
              />
              {(formData.heroVideo || existingImages.heroVideo) && (
                <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '12px', color: '#10b981' }}>Video: {formData.heroVideo?.name || 'Existante'}</span>
                  <button type="button" onClick={() => removeFile('heroVideo')} style={{ backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', padding: '2px 6px', fontSize: '10px', cursor: 'pointer' }}>X</button>
                </div>
              )}
            </div>
          </div>

          {/* Drag & Drop Hero - ratio 16/9 comme sur le site */}
          {(previews.heroImage || existingImages.heroImage) && (
            <DraggableImageCard
              imageKey="heroImage"
              previewUrl={previews.heroImage || (existingImages.heroImage as string)}
              label="Position dans la section Hero"
              aspectRatio="16/9"
              color="#f59e0b"
              sectionName={formData.name || 'NOM DU TALENT'}
            />
          )}
        </div>

        {/* ===== SECTION 3: PORTFOLIO (pleine largeur sur le site) ===== */}
        <div style={{
          padding: '24px',
          backgroundColor: '#dbeafe',
          borderRadius: '12px',
          border: '1px solid #3b82f6',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <span style={{ padding: '4px 12px', backgroundColor: '#3b82f6', color: 'white', fontSize: '11px', fontWeight: 600, borderRadius: '4px' }}>
              PORTFOLIO
            </span>
            <h4 style={{ fontSize: '15px', fontWeight: 600, color: '#0f172a', margin: 0 }}>
              Section Portfolio (pleine largeur sur le site)
            </h4>
          </div>
          <p style={{ fontSize: '13px', color: '#1e40af', marginBottom: '20px' }}>
            Section cliquable qui mène à la galerie portfolio. Ratio 16/9 (paysage).
          </p>

          <ImageUploadField fieldKey="portfolioImage" label="Image Portfolio (cover)" />

          {(previews.portfolioImage || existingImages.portfolioImage) && (
            <div style={{ marginTop: '20px' }}>
              <DraggableImageCard
                imageKey="portfolioImage"
                previewUrl={previews.portfolioImage || (existingImages.portfolioImage as string)}
                label="Position dans la section Portfolio"
                aspectRatio="16/9"
                color="#3b82f6"
                sectionName="PORTFOLIO"
              />
            </div>
          )}
        </div>

        {/* ===== SECTION 4: SHOWS + SOCIAL (côte à côte sur le site) ===== */}
        <div style={{
          padding: '24px',
          backgroundColor: '#f0fdf4',
          borderRadius: '12px',
          border: '1px solid #22c55e',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <span style={{ padding: '4px 12px', backgroundColor: '#22c55e', color: 'white', fontSize: '11px', fontWeight: 600, borderRadius: '4px' }}>
              SHOWS + SOCIAL
            </span>
            <h4 style={{ fontSize: '15px', fontWeight: 600, color: '#0f172a', margin: 0 }}>
              Sections Shows & Social (côte à côte sur le site)
            </h4>
          </div>
          <p style={{ fontSize: '13px', color: '#166534', marginBottom: '20px' }}>
            Ces deux sections apparaissent côte à côte. Ratio 1/1 (carré) chacune.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            {/* Shows */}
            <div style={{ padding: '16px', backgroundColor: 'white', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <h5 style={{ fontSize: '14px', fontWeight: 600, color: '#0f172a', marginBottom: '12px' }}>Shows</h5>
              <ImageUploadField fieldKey="showsImage" label="Image Shows" />
              <div style={{ marginTop: '12px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#64748b', marginBottom: '6px' }}>Vidéo Shows (optionnel)</label>
                <input type="file" accept="video/*" onChange={(e) => e.target.files && handleFileChange('showsVideo', e.target.files[0])} style={{ width: '100%', padding: '8px', border: '1px solid #e2e8f0', borderRadius: '4px', fontSize: '13px' }} />
                {(formData.showsVideo || existingImages.showsVideo) && <p style={{ fontSize: '11px', color: '#10b981', marginTop: '4px' }}>Video: {formData.showsVideo?.name || 'Existante'}</p>}
              </div>
              {(previews.showsImage || existingImages.showsImage) && (
                <div style={{ marginTop: '16px' }}>
                  <DraggableImageCard
                    imageKey="showsImage"
                    previewUrl={previews.showsImage || (existingImages.showsImage as string)}
                    label="Position Shows"
                    aspectRatio="1/1"
                    color="#22c55e"
                    sectionName="SHOWS"
                  />
                </div>
              )}
            </div>

            {/* Social */}
            <div style={{ padding: '16px', backgroundColor: 'white', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <h5 style={{ fontSize: '14px', fontWeight: 600, color: '#0f172a', marginBottom: '12px' }}>Social / Instagram</h5>
              <ImageUploadField fieldKey="instagramImage" label="Image Instagram" />
              <div style={{ marginTop: '12px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#64748b', marginBottom: '6px' }}>URL Instagram</label>
                <input type="url" value={formData.instagramUrl} onChange={(e) => setFormData(prev => ({ ...prev, instagramUrl: e.target.value }))} placeholder="https://instagram.com/..." style={{ width: '100%', padding: '8px', border: '1px solid #e2e8f0', borderRadius: '4px', fontSize: '13px' }} />
              </div>
              {(previews.instagramImage || existingImages.instagramImage) && (
                <div style={{ marginTop: '16px' }}>
                  <DraggableImageCard
                    imageKey="instagramImage"
                    previewUrl={previews.instagramImage || (existingImages.instagramImage as string)}
                    label="Position Social"
                    aspectRatio="1/1"
                    color="#ec4899"
                    sectionName="SOCIAL"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderStep3 = () => {
    // Titres dynamiques selon le type
    const sectionTitles = {
      MODELS: 'Portfolio & Instagram',
      ACTING: 'Showreel & Instagram',
      PROMO: 'My Work & Instagram',
      DETAILS: 'Portfolio & Instagram'
    };

    // Champs à utiliser selon le type
    const getFieldNames = () => {
      if (formData.type === 'MODELS' || formData.type === 'DETAILS') {
        return { image: 'portfolioImage', gallery: 'portfolioGallery', video: null };
      } else if (formData.type === 'ACTING') {
        return { image: 'showreelImage', gallery: 'reelsGallery', video: 'showreelVideo' };
      } else { // PROMO
        return { image: 'portfolioImage', gallery: 'galleryImages', video: null };
      }
    };

    const fields = getFieldNames();

    const imageLabels: Record<string, { single: string; gallery: string; video?: string }> = {
      MODELS: { single: 'Image Portfolio', gallery: 'Galerie Portfolio' },
      ACTING: { single: 'Cover Image - Pour section SHOWREEL', gallery: 'Galerie Showreel (vidéos) - Pour section SHOWREEL', video: 'Vidéo Showreel principale - Pour section SHOWREEL' },
      PROMO: { single: 'Cover Image - Pour section MY WORK', gallery: 'Galerie Portfolio - Pour section MY WORK' },
      DETAILS: { single: 'Cover Image - Pour section MY WORK', gallery: 'Galerie Portfolio - Pour section MY WORK' }
    };

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#0f172a', marginBottom: '8px' }}>
          {sectionTitles[formData.type]}
        </h3>

        {/* Showreel Video principal - uniquement pour ACTING */}
        {fields.video && (
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#475569', marginBottom: '8px' }}>
              {imageLabels[formData.type].video}
            </label>
            <input
              type="file"
              accept="video/*"
              onChange={(e) => e.target.files && handleFileChange(fields.video!, e.target.files[0])}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #e2e8f0',
                borderRadius: '6px',
                fontSize: '14px',
              }}
            />
            {formData[fields.video as keyof typeof formData] && (
              <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <p style={{ fontSize: '13px', color: '#10b981' }}>
                  ✓ Vidéo sélectionnée : {(formData[fields.video as keyof typeof formData] as File).name}
                </p>
                <button
                  type="button"
                  onClick={() => removeFile(fields.video!)}
                  style={{
                    backgroundColor: '#ef4444',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '4px 10px',
                    fontSize: '12px',
                    fontWeight: 500,
                    cursor: 'pointer',
                  }}
                >
                  Supprimer
                </button>
              </div>
            )}
          </div>
        )}

        {/* Portfolio/Showreel image - sauf pour PROMO */}
        {fields.image && (
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#475569', marginBottom: '8px' }}>
              {imageLabels[formData.type].single}
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => e.target.files && handleFileChange(fields.image!, e.target.files[0])}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #e2e8f0',
                borderRadius: '6px',
                fontSize: '14px',
              }}
            />
            {previews[fields.image] && (
              <div style={{ marginTop: '12px', position: 'relative', display: 'inline-block' }}>
                <img src={previews[fields.image]} alt="Preview" style={{ maxWidth: '200px', borderRadius: '6px', display: 'block' }} />
                <button
                  type="button"
                  onClick={() => removeFile(fields.image!)}
                  style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    backgroundColor: '#ef4444',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '6px 12px',
                    fontSize: '12px',
                    fontWeight: 500,
                    cursor: 'pointer',
                  }}
                >
                  Supprimer
                </button>
              </div>
            )}
          </div>
        )}

        {/* Gallery - sauf pour PROMO */}
        {fields.gallery && (
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#475569', marginBottom: '8px' }}>
              {imageLabels[formData.type].gallery}
            </label>
            <input
              type="file"
              accept={formData.type === 'ACTING' ? "video/*" : "image/*"}
              multiple
              onChange={(e) => e.target.files && handleGalleryChange(fields.gallery!, e.target.files)}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #e2e8f0',
                borderRadius: '6px',
                fontSize: '14px',
              }}
            />
            {/* Show both new files and existing images */}
            {(() => {
              const newFiles = formData[fields.gallery as keyof typeof formData] as File[] || [];
              const existingUrls = existingImages[fields.gallery as keyof typeof existingImages] as string[] || [];
              const totalCount = newFiles.length > 0 ? newFiles.length : (existingUrls.length || 0);

              return totalCount > 0 && (
                <div style={{ marginTop: '12px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '8px' }}>
                  {Array.from({ length: totalCount }, (_, index) => (
                    previews[`${fields.gallery}_${index}`] && (
                      <div key={index} style={{ position: 'relative' }}>
                        <img
                          src={previews[`${fields.gallery}_${index}`]}
                          alt={`Gallery ${index}`}
                          style={{ width: '100%', height: '100px', objectFit: 'cover', borderRadius: '6px' }}
                        />
                        <button
                          type="button"
                          onClick={() => removeGalleryImage(fields.gallery!, index)}
                          style={{
                            position: 'absolute',
                            top: '4px',
                            right: '4px',
                            backgroundColor: '#ef4444',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            padding: '4px 8px',
                            fontSize: '11px',
                            fontWeight: 500,
                            cursor: 'pointer',
                          }}
                        >
                          ×
                        </button>
                      </div>
                    )
                  ))}
                </div>
              );
            })()}
          </div>
        )}

      <div>
        <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#475569', marginBottom: '8px' }}>
          {formData.type === 'PROMO' || formData.type === 'ACTING' || formData.type === 'DETAILS' ? 'Cover Image - Pour section SOCIAL' : 'Image Instagram'}
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => e.target.files && handleFileChange('instagramImage', e.target.files[0])}
          style={{
            width: '100%',
            padding: '10px 12px',
            border: '1px solid #e2e8f0',
            borderRadius: '6px',
            fontSize: '14px',
          }}
        />
        {previews.instagramImage && (
          <div style={{ marginTop: '12px', position: 'relative', display: 'inline-block' }}>
            <img src={previews.instagramImage} alt="Preview" style={{ maxWidth: '200px', borderRadius: '6px', display: 'block' }} />
            <button
              type="button"
              onClick={() => removeFile('instagramImage')}
              style={{
                position: 'absolute',
                top: '8px',
                right: '8px',
                backgroundColor: '#ef4444',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                padding: '6px 12px',
                fontSize: '12px',
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              Supprimer
            </button>
          </div>
        )}
      </div>

      <div>
        <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#475569', marginBottom: '8px' }}>
          {formData.type === 'PROMO' || formData.type === 'ACTING' || formData.type === 'DETAILS' ? 'URL Instagram - Pour section SOCIAL' : 'URL Instagram'}
        </label>
        <input
          type="url"
          value={formData.instagramUrl}
          onChange={(e) => setFormData(prev => ({ ...prev, instagramUrl: e.target.value }))}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
            }
          }}
          style={{
            width: '100%',
            padding: '10px 12px',
            border: '1px solid #e2e8f0',
            borderRadius: '6px',
            fontSize: '14px',
          }}
          placeholder="https://instagram.com/..."
        />
      </div>
    </div>
    );
  };

  const renderStep4 = () => {
    const sectionTitles = {
      MODELS: 'Shows & Vidéos',
      ACTING: 'Credits',
      PROMO: 'Shows & Vidéos',
      DETAILS: 'Campaigns'
    };

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#0f172a', marginBottom: '8px' }}>
          {sectionTitles[formData.type]}
        </h3>

        {/* MODELS: Shows (image + video) */}
        {formData.type === 'MODELS' && (
          <>
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#475569', marginBottom: '8px' }}>
                Image Shows
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => e.target.files && handleFileChange('showsImage', e.target.files[0])}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px',
                  fontSize: '14px',
                }}
              />
              {previews.showsImage && (
                <div style={{ marginTop: '12px', position: 'relative', display: 'inline-block' }}>
                  <img src={previews.showsImage} alt="Preview" style={{ maxWidth: '200px', borderRadius: '6px', display: 'block' }} />
                  <button
                    type="button"
                    onClick={() => removeFile('showsImage')}
                    style={{
                      position: 'absolute',
                      top: '8px',
                      right: '8px',
                      backgroundColor: '#ef4444',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      padding: '6px 12px',
                      fontSize: '12px',
                      fontWeight: 500,
                      cursor: 'pointer',
                    }}
                  >
                    Supprimer
                  </button>
                </div>
              )}
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#475569', marginBottom: '8px' }}>
                Vidéo Shows
              </label>
              <input
                type="file"
                accept="video/*"
                onChange={(e) => e.target.files && handleFileChange('showsVideo', e.target.files[0])}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px',
                  fontSize: '14px',
                }}
              />
              {formData.showsVideo && (
                <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <p style={{ fontSize: '13px', color: '#10b981' }}>
                    ✓ Vidéo sélectionnée : {formData.showsVideo.name}
                  </p>
                  <button
                    type="button"
                    onClick={() => removeFile('showsVideo')}
                    style={{
                      backgroundColor: '#ef4444',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      padding: '4px 10px',
                      fontSize: '12px',
                      fontWeight: 500,
                      cursor: 'pointer',
                    }}
                  >
                    Supprimer
                  </button>
                </div>
              )}
            </div>
          </>
        )}

        {/* ACTING: Credits */}
        {formData.type === 'ACTING' && (
          <>
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#475569', marginBottom: '8px' }}>
                Cover Image - Pour section CREDITS
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => e.target.files && handleFileChange('creditsImage', e.target.files[0])}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px',
                  fontSize: '14px',
                }}
              />
              {previews.creditsImage && (
                <div style={{ marginTop: '12px', position: 'relative', display: 'inline-block' }}>
                  <img src={previews.creditsImage} alt="Preview" style={{ maxWidth: '200px', borderRadius: '6px', display: 'block' }} />
                  <button
                    type="button"
                    onClick={() => removeFile('creditsImage')}
                    style={{
                      position: 'absolute',
                      top: '8px',
                      right: '8px',
                      backgroundColor: '#ef4444',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      padding: '6px 12px',
                      fontSize: '12px',
                      fontWeight: 500,
                      cursor: 'pointer',
                    }}
                  >
                    Supprimer
                  </button>
                </div>
              )}
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#475569', marginBottom: '12px' }}>
                Credits List (optionnel)
              </label>
              <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '12px' }}>
                Films, séries, théâtre, publicités, etc.
              </p>

              {/* Liste des credits existants */}
              {formData.credits.length > 0 && (
                <div style={{ marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {formData.credits.map((credit, index) => (
                    <div key={index} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '12px',
                      backgroundColor: '#f8fafc',
                      borderRadius: '6px',
                      border: '1px solid #e2e8f0'
                    }}>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: '14px', fontWeight: 500, color: '#0f172a', marginBottom: '4px' }}>
                          {credit.title}
                        </p>
                        <p style={{ fontSize: '13px', color: '#64748b' }}>
                          {credit.role} • {credit.year} • {credit.type}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const newCredits = formData.credits.filter((_, i) => i !== index);
                          setFormData(prev => ({ ...prev, credits: newCredits }));
                        }}
                        style={{
                          backgroundColor: '#ef4444',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          padding: '6px 12px',
                          fontSize: '12px',
                          fontWeight: 500,
                          cursor: 'pointer',
                        }}
                      >
                        Supprimer
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Bouton pour ajouter un crédit */}
              <button
                type="button"
                onClick={() => {
                  const title = prompt('Titre (film, série, théâtre...) :');
                  if (!title) return;
                  const role = prompt('Rôle :');
                  if (!role) return;
                  const year = prompt('Année :');
                  if (!year) return;
                  const type = prompt('Type (Film, Série, Théâtre, Publicité...) :');
                  if (!type) return;

                  setFormData(prev => ({
                    ...prev,
                    credits: [...prev.credits, { title, role, year, type }]
                  }));
                }}
                style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: '#f1f5f9',
                  border: '1px dashed #cbd5e1',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: 500,
                  color: '#475569',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = '#e2e8f0';
                  e.currentTarget.style.borderColor = '#94a3b8';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = '#f1f5f9';
                  e.currentTarget.style.borderColor = '#cbd5e1';
                }}
              >
                + Ajouter un crédit
              </button>
            </div>
          </>
        )}

        {/* PROMO: Shows Section */}
        {formData.type === 'PROMO' && (
          <>
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#475569', marginBottom: '8px' }}>
                Cover Image - Pour section SHOWS
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => e.target.files && handleFileChange('showsImage', e.target.files[0])}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px',
                  fontSize: '14px',
                }}
              />
              {previews.showsImage && (
                <div style={{ marginTop: '12px', position: 'relative', display: 'inline-block' }}>
                  <img src={previews.showsImage} alt="Preview" style={{ maxWidth: '200px', borderRadius: '6px', display: 'block' }} />
                  <button
                    type="button"
                    onClick={() => removeFile('showsImage')}
                    style={{
                      position: 'absolute',
                      top: '8px',
                      right: '8px',
                      backgroundColor: '#ef4444',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      padding: '6px 12px',
                      fontSize: '12px',
                      fontWeight: 500,
                      cursor: 'pointer',
                    }}
                  >
                    Supprimer
                  </button>
                </div>
              )}
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#475569', marginBottom: '8px' }}>
                Vidéo Shows - Pour section SHOWS (optionnel)
              </label>
              <input
                type="file"
                accept="video/*"
                onChange={(e) => e.target.files && handleFileChange('showsVideo', e.target.files[0])}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px',
                  fontSize: '14px',
                }}
              />
              {formData.showsVideo && (
                <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <p style={{ fontSize: '13px', color: '#10b981' }}>
                    ✓ Vidéo sélectionnée : {formData.showsVideo.name}
                  </p>
                  <button
                    type="button"
                    onClick={() => removeFile('showsVideo')}
                    style={{
                      backgroundColor: '#ef4444',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      padding: '4px 10px',
                      fontSize: '12px',
                      fontWeight: 500,
                      cursor: 'pointer',
                    }}
                  >
                    Supprimer
                  </button>
                </div>
              )}
            </div>
          </>
        )}

        {/* DETAILS: Campaigns */}
        {formData.type === 'DETAILS' && (
          <>
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#475569', marginBottom: '8px' }}>
                Cover Image - Pour section CAMPAIGNS
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => e.target.files && handleFileChange('campaignsImage', e.target.files[0])}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px',
                  fontSize: '14px',
                }}
              />
              {previews.campaignsImage && (
                <div style={{ marginTop: '12px', position: 'relative', display: 'inline-block' }}>
                  <img src={previews.campaignsImage} alt="Preview" style={{ maxWidth: '200px', borderRadius: '6px', display: 'block' }} />
                  <button
                    type="button"
                    onClick={() => removeFile('campaignsImage')}
                    style={{
                      position: 'absolute',
                      top: '8px',
                      right: '8px',
                      backgroundColor: '#ef4444',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      padding: '6px 12px',
                      fontSize: '12px',
                      fontWeight: 500,
                      cursor: 'pointer',
                    }}
                  >
                    Supprimer
                  </button>
                </div>
              )}
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#475569', marginBottom: '12px' }}>
                Campaigns List (optionnel)
              </label>
              <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '12px' }}>
                Ajoutez les campagnes publicitaires (marques, collaborations...)
              </p>

              {/* Liste des campaigns existantes */}
              {formData.campaigns.length > 0 && (
                <div style={{ marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {formData.campaigns.map((campaign, index) => (
                    <div key={index} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '12px',
                      backgroundColor: '#f8fafc',
                      borderRadius: '6px',
                      border: '1px solid #e2e8f0'
                    }}>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: '14px', fontWeight: 500, color: '#0f172a', marginBottom: '4px' }}>
                          {campaign.brandName}
                        </p>
                        {(campaign.year || campaign.type) && (
                          <p style={{ fontSize: '13px', color: '#64748b' }}>
                            {campaign.year && <span>{campaign.year}</span>}
                            {campaign.year && campaign.type && <span> • </span>}
                            {campaign.type && <span>{campaign.type}</span>}
                          </p>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const newCampaigns = formData.campaigns.filter((_, i) => i !== index);
                          setFormData(prev => ({ ...prev, campaigns: newCampaigns }));
                        }}
                        style={{
                          backgroundColor: '#ef4444',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          padding: '6px 12px',
                          fontSize: '12px',
                          fontWeight: 500,
                          cursor: 'pointer',
                        }}
                      >
                        Supprimer
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Bouton pour ajouter une campagne */}
              <button
                type="button"
                onClick={() => {
                  const brandName = prompt('Nom de la marque :');
                  if (!brandName) return;
                  const year = prompt('Année (optionnel) :');
                  const type = prompt('Type (Fashion, Beauty, Lifestyle...) (optionnel) :');

                  setFormData(prev => ({
                    ...prev,
                    campaigns: [...prev.campaigns, { brandName, year: year || '', type: type || '' }]
                  }));
                }}
                style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: '#f1f5f9',
                  border: '1px dashed #cbd5e1',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: 500,
                  color: '#475569',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = '#e2e8f0';
                  e.currentTarget.style.borderColor = '#94a3b8';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = '#f1f5f9';
                  e.currentTarget.style.borderColor = '#cbd5e1';
                }}
              >
                + Ajouter une campagne
              </button>
            </div>
          </>
        )}

        {/* SECTION EXPERIENCE (commun à tous les types) */}
        <div style={{
          padding: '24px',
          backgroundColor: '#f0f9ff',
          borderRadius: '12px',
          border: '1px solid #bae6fd',
          marginTop: '24px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <span style={{ padding: '4px 12px', backgroundColor: '#0ea5e9', color: 'white', fontSize: '11px', fontWeight: 600, borderRadius: '4px' }}>EXPERIENCE</span>
            <h4 style={{ fontSize: '15px', fontWeight: 600, color: '#0f172a', margin: 0 }}>Section Experience (Shows, Credits, Collabs, Campaigns)</h4>
          </div>
          <p style={{ fontSize: '13px', color: '#0369a1', marginBottom: '20px' }}>
            Cette section regroupe toutes les expériences du talent sur le site public. Cliquez sur une expérience pour la modifier.
          </p>

          {/* Grille des experiences */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px', marginBottom: '16px' }}>
            {(formData.experiences || []).map((exp, index) => {
              const typeColors: Record<string, { bg: string; color: string }> = {
                show: { bg: '#6366f1', color: '#eef2ff' },
                credit: { bg: '#f59e0b', color: '#fef3c7' },
                collab: { bg: '#10b981', color: '#d1fae5' },
                campaign: { bg: '#ec4899', color: '#fce7f3' },
              };
              const colors = typeColors[exp.type] || typeColors.show;
              const hasImage = exp.images && exp.images.length > 0;

              return (
                <div
                  key={exp.id}
                  style={{
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    border: `2px solid ${colors.bg}30`,
                    overflow: 'hidden',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  onClick={() => openExperienceModal(index)}
                  onMouseOver={(e) => {
                    e.currentTarget.style.borderColor = colors.bg;
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.borderColor = `${colors.bg}30`;
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  {/* Image preview ou placeholder */}
                  <div style={{
                    width: '100%',
                    aspectRatio: '16/9',
                    backgroundColor: hasImage ? '#000' : colors.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    overflow: 'hidden',
                  }}>
                    {hasImage ? (
                      <img
                        src={exp.images[0]}
                        alt={exp.title}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          objectPosition: `${exp.imagePosition?.x || 50}% ${exp.imagePosition?.y || 50}%`,
                        }}
                      />
                    ) : (
                      <span style={{ fontSize: '40px', opacity: 0.5 }}>
                        {exp.type === 'show' ? '👗' : exp.type === 'credit' ? '🎬' : exp.type === 'collab' ? '🤝' : '📸'}
                      </span>
                    )}
                    {/* Badge type */}
                    <span style={{
                      position: 'absolute',
                      top: '8px',
                      left: '8px',
                      padding: '4px 10px',
                      backgroundColor: colors.bg,
                      color: 'white',
                      fontSize: '10px',
                      fontWeight: 700,
                      borderRadius: '4px',
                      textTransform: 'uppercase',
                    }}>
                      {exp.type}
                    </span>
                    {/* Badge images count */}
                    {hasImage && exp.images.length > 1 && (
                      <span style={{
                        position: 'absolute',
                        top: '8px',
                        right: '8px',
                        padding: '4px 8px',
                        backgroundColor: 'rgba(0,0,0,0.7)',
                        color: 'white',
                        fontSize: '10px',
                        fontWeight: 600,
                        borderRadius: '4px',
                      }}>
                        +{exp.images.length - 1}
                      </span>
                    )}
                  </div>

                  {/* Infos */}
                  <div style={{ padding: '12px 16px' }}>
                    <p style={{ fontSize: '14px', fontWeight: 600, color: '#0f172a', margin: '0 0 4px 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {exp.title}
                    </p>
                    <p style={{ fontSize: '12px', color: '#64748b', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {[exp.brand, exp.role, exp.year].filter(Boolean).join(' • ') || 'Cliquez pour ajouter des détails'}
                    </p>
                  </div>

                  {/* Actions */}
                  <div style={{
                    display: 'flex',
                    borderTop: '1px solid #f1f5f9',
                    backgroundColor: '#f8fafc',
                  }}>
                    {/* Monter */}
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={(e) => {
                        e.stopPropagation();
                        const newExps = [...(formData.experiences || [])];
                        [newExps[index - 1], newExps[index]] = [newExps[index], newExps[index - 1]];
                        newExps.forEach((exp, i) => exp.order = i);
                        setFormData(prev => ({ ...prev, experiences: newExps }));
                      }}
                      style={{
                        flex: 1,
                        padding: '8px',
                        border: 'none',
                        backgroundColor: 'transparent',
                        cursor: index === 0 ? 'not-allowed' : 'pointer',
                        opacity: index === 0 ? 0.3 : 1,
                        fontSize: '14px',
                      }}
                    >
                      ↑
                    </button>
                    {/* Descendre */}
                    <button
                      type="button"
                      disabled={index === (formData.experiences?.length || 0) - 1}
                      onClick={(e) => {
                        e.stopPropagation();
                        const newExps = [...(formData.experiences || [])];
                        [newExps[index], newExps[index + 1]] = [newExps[index + 1], newExps[index]];
                        newExps.forEach((exp, i) => exp.order = i);
                        setFormData(prev => ({ ...prev, experiences: newExps }));
                      }}
                      style={{
                        flex: 1,
                        padding: '8px',
                        border: 'none',
                        borderLeft: '1px solid #e2e8f0',
                        backgroundColor: 'transparent',
                        cursor: index === (formData.experiences?.length || 0) - 1 ? 'not-allowed' : 'pointer',
                        opacity: index === (formData.experiences?.length || 0) - 1 ? 0.3 : 1,
                        fontSize: '14px',
                      }}
                    >
                      ↓
                    </button>
                    {/* Supprimer */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm('Supprimer cette expérience ?')) {
                          setFormData(prev => ({ ...prev, experiences: (prev.experiences || []).filter((_, i) => i !== index) }));
                        }
                      }}
                      style={{
                        flex: 1,
                        padding: '8px',
                        border: 'none',
                        borderLeft: '1px solid #e2e8f0',
                        backgroundColor: 'transparent',
                        cursor: 'pointer',
                        color: '#ef4444',
                        fontSize: '14px',
                      }}
                    >
                      ✕
                    </button>
                  </div>
                </div>
              );
            })}

            {/* Bouton ajouter (dans la grille) */}
            <button
              type="button"
              onClick={() => openExperienceModal(null)}
              style={{
                minHeight: '200px',
                backgroundColor: 'white',
                border: '2px dashed #0ea5e950',
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: 600,
                color: '#0ea5e9',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                transition: 'all 0.2s',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.borderColor = '#0ea5e9';
                e.currentTarget.style.backgroundColor = '#f0f9ff';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.borderColor = '#0ea5e950';
                e.currentTarget.style.backgroundColor = 'white';
              }}
            >
              <span style={{ fontSize: '32px', opacity: 0.7 }}>+</span>
              <span>Ajouter une expérience</span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderStep5 = () => {
    // Common fields for all types
    const commonFields = [
      { key: 'height', label: 'Height', placeholder: '175cm' },
      { key: 'eyes', label: 'Eyes', placeholder: 'Blue' },
      { key: 'hair', label: 'Hair', placeholder: 'Brown' },
    ];

    // Type-specific measurement fields
    const typeSpecificFields: Record<string, { key: string; label: string; placeholder: string; type?: string }[]> = {
      MODELS: [
        { key: 'neck', label: 'Neck', placeholder: '38cm' },
        { key: 'bust', label: 'Bust', placeholder: '86cm' },
        { key: 'chest', label: 'Chest', placeholder: '97cm' },
        { key: 'waist', label: 'Waist', placeholder: '68cm' },
        { key: 'hips', label: 'Hips', placeholder: '92cm' },
        { key: 'suit', label: 'Suit', placeholder: '48' },
        { key: 'inseam', label: 'Inseam', placeholder: '81cm' },
        { key: 'shoes', label: 'Shoes', placeholder: '42' },
      ],
      ACTING: [
        { key: 'ageRange', label: 'Age Range', placeholder: '25-35' },
        { key: 'languages', label: 'Languages (comma separated)', placeholder: 'English, French, Spanish' },
        { key: 'skills', label: 'Skills (comma separated)', placeholder: 'Dancing, Singing, Martial Arts' },
      ],
      PROMO: [
        { key: 'instagramFollowers', label: 'Instagram Followers', placeholder: '50000', type: 'number' },
        { key: 'tiktokUrl', label: 'TikTok URL', placeholder: 'https://tiktok.com/@...' },
        { key: 'tiktokFollowers', label: 'TikTok Followers', placeholder: '100000', type: 'number' },
      ],
      DETAILS: [
        { key: 'handSize', label: 'Hand Size', placeholder: '18cm' },
        { key: 'ringSize', label: 'Ring Size', placeholder: '54' },
        { key: 'wristSize', label: 'Wrist Size', placeholder: '15cm' },
        { key: 'footSize', label: 'Foot Size', placeholder: '38' },
        { key: 'legLength', label: 'Leg Length', placeholder: '85cm' },
        { key: 'neckSize', label: 'Neck Size', placeholder: '35cm' },
        { key: 'waist', label: 'Waist (Details)', placeholder: '65cm' },
        { key: 'hips', label: 'Hips (Details)', placeholder: '90cm' },
        { key: 'bust', label: 'Bust (Details)', placeholder: '85cm' },
        { key: 'skinTone', label: 'Skin Tone', placeholder: 'Medium' },
        { key: 'faceSpecialty', label: 'Face Specialty (comma separated)', placeholder: 'Expressive eyes, High cheekbones' },
      ],
    };

    // Type colors for sections
    const typeColors: Record<string, string> = {
      MODELS: '#6366f1',
      ACTING: '#f59e0b',
      PROMO: '#10b981',
      DETAILS: '#ec4899',
    };

    // Type commun pour tous les champs
    type FieldType = { key: string; label: string; placeholder: string; type?: string };

    // Collecter les champs de TOUS les types sélectionnés
    const allTypeFields: { type: string; fields: FieldType[] }[] = [];
    formData.types.forEach(type => {
      if (typeSpecificFields[type]) {
        allTypeFields.push({ type, fields: typeSpecificFields[type] });
      }
    });

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#0f172a', marginBottom: '8px' }}>
          Mensurations & Informations
        </h3>

        {/* Champs communs */}
        <div style={{
          padding: '20px',
          backgroundColor: '#f8fafc',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
        }}>
          <p style={{ fontSize: '14px', fontWeight: 600, color: '#475569', marginBottom: '16px' }}>
            Informations communes
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
            {commonFields.map(field => (
              <div key={field.key}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#64748b', marginBottom: '6px' }}>
                  {field.label}
                </label>
                <input
                  type="text"
                  value={formData[field.key as keyof typeof formData] as string}
                  onChange={(e) => setFormData(prev => ({ ...prev, [field.key]: e.target.value }))}
                  onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault(); }}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #e2e8f0',
                    borderRadius: '6px',
                    fontSize: '14px',
                  }}
                  placeholder={field.placeholder}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Champs spécifiques par type sélectionné */}
        {allTypeFields.map(({ type, fields }) => (
          <div key={type} style={{
            padding: '20px',
            backgroundColor: 'white',
            borderRadius: '12px',
            border: `2px solid ${typeColors[type]}20`,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <span style={{
                padding: '4px 12px',
                backgroundColor: typeColors[type],
                color: 'white',
                fontSize: '12px',
                fontWeight: 600,
                borderRadius: '6px',
              }}>
                {type}
              </span>
              <p style={{ fontSize: '14px', fontWeight: 500, color: '#475569' }}>
                Champs spécifiques
              </p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
              {fields.map(field => (
                <div key={field.key}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#64748b', marginBottom: '6px' }}>
                    {field.label}
                  </label>
                  <input
                    type={field.type || 'text'}
                    value={formData[field.key as keyof typeof formData] as string}
                    onChange={(e) => {
                      const value = field.type === 'number' ? parseInt(e.target.value) || '' : e.target.value;
                      setFormData(prev => ({ ...prev, [field.key]: value }));
                    }}
                    onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault(); }}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid #e2e8f0',
                      borderRadius: '6px',
                      fontSize: '14px',
                    }}
                    placeholder={field.placeholder}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderStep6 = () => {
    const typeColors: Record<string, string> = {
      MODELS: '#6366f1',
      ACTING: '#f59e0b',
      PROMO: '#10b981',
      DETAILS: '#ec4899',
    };

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#0f172a', marginBottom: '8px' }}>
          Récapitulatif
        </h3>
        <p style={{ fontSize: '14px', color: '#64748b' }}>
          Vérifiez toutes les informations avant de valider les modifications.
        </p>
        <div style={{ padding: '16px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <p style={{ fontSize: '14px', color: '#475569' }}>
            <strong>Nom:</strong> {formData.name}
          </p>
          <div style={{ marginTop: '12px' }}>
            <strong style={{ fontSize: '14px', color: '#475569' }}>Types:</strong>
            <div style={{ display: 'flex', gap: '8px', marginTop: '8px', flexWrap: 'wrap' }}>
              {formData.types.map((type, index) => (
                <span
                  key={type}
                  style={{
                    padding: '4px 12px',
                    backgroundColor: typeColors[type],
                    color: 'white',
                    fontSize: '12px',
                    fontWeight: 500,
                    borderRadius: '16px',
                  }}
                >
                  {index === 0 && '★ '}{type}
                </span>
              ))}
            </div>
          </div>
          <p style={{ fontSize: '14px', color: '#475569', marginTop: '12px' }}>
            <strong>Catégorie:</strong> {formData.category}
          </p>
          <p style={{ fontSize: '14px', color: '#475569', marginTop: '8px' }}>
            <strong>Statut:</strong> {formData.status}
          </p>
        </div>
      </div>
    );
  };

  if (loadingData) {
    return (
      <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f1f5f9' }}>
        <AdminSidebar />
        <div style={{
          flex: 1,
          marginLeft: `${sidebarWidth}px`,
          padding: '32px 40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <p style={{ fontSize: '16px', color: '#64748b' }}>Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f1f5f9' }}>
      <AdminSidebar />

      <div style={{
        flex: 1,
        marginLeft: `${sidebarWidth}px`,
        padding: '32px 40px',
        transition: 'margin-left 0.3s ease'
      }}>
        {/* Header */}
        <div style={{ marginBottom: '32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 600, color: '#0f172a', marginBottom: '4px' }}>
              Modifier le Model
            </h1>
            <p style={{ fontSize: '14px', color: '#64748b' }}>
              Étape {currentStep + 1} sur 7
            </p>
          </div>
          <button
            onClick={() => router.push('/admin/models')}
            style={{
              padding: '10px 20px',
              backgroundColor: '#f1f5f9',
              border: '1px solid #e2e8f0',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: 500,
              color: '#475569',
              cursor: 'pointer',
            }}
          >
            Annuler
          </button>
        </div>

        {/* Progress Bar */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
            {[0, 1, 2, 3, 4, 5, 6].map(step => (
              <div
                key={step}
                style={{
                  flex: 1,
                  height: '4px',
                  backgroundColor: step <= currentStep ? '#6366f1' : '#e2e8f0',
                  borderRadius: '2px',
                  transition: 'background-color 0.3s',
                }}
              />
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#64748b' }}>
            <span>Type</span>
            <span>Infos</span>
            <span>Images</span>
            <span>Portfolio</span>
            <span>Shows</span>
            <span>Measurements</span>
            <span>Review</span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div style={{
            backgroundColor: 'white',
            padding: '32px',
            borderRadius: '8px',
            boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
            border: '1px solid #e2e8f0',
            marginBottom: '24px'
          }}>
            {currentStep === 0 && renderStep0()}
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}
            {currentStep === 4 && renderStep4()}
            {currentStep === 5 && renderStep5()}
            {currentStep === 6 && renderStep6()}
          </div>

          {/* Navigation Buttons */}
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <button
              type="button"
              onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
              disabled={currentStep === 0}
              style={{
                padding: '12px 24px',
                backgroundColor: currentStep === 0 ? '#f1f5f9' : 'white',
                border: '1px solid #e2e8f0',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: 500,
                color: currentStep === 0 ? '#94a3b8' : '#475569',
                cursor: currentStep === 0 ? 'not-allowed' : 'pointer',
              }}
            >
              Précédent
            </button>

            {currentStep < 6 ? (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setCurrentStep(prev => Math.min(6, prev + 1));
                }}
                style={{
                  padding: '12px 24px',
                  backgroundColor: '#6366f1',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: 500,
                  color: 'white',
                  cursor: 'pointer',
                }}
              >
                Suivant
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading || !formData.name || (!formData.mainImage && !existingImages.mainImage)}
                onClick={(e) => {
                  // Ne soumettre que si on est bien à l'étape 6
                  if (currentStep !== 6) {
                    e.preventDefault();
                    e.stopPropagation();
                    return false;
                  }
                }}
                style={{
                  padding: '12px 24px',
                  backgroundColor: loading || !formData.name || (!formData.mainImage && !existingImages.mainImage) ? '#94a3b8' : '#10b981',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: 500,
                  color: 'white',
                  cursor: loading || !formData.name || (!formData.mainImage && !existingImages.mainImage) ? 'not-allowed' : 'pointer',
                }}
              >
                {loading ? 'Modification en cours...' : 'Modifier le Talent'}
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Modal Experience */}
      {experienceModal.isOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px',
          }}
          onClick={closeExperienceModal}
        >
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              width: '100%',
              maxWidth: '700px',
              maxHeight: '90vh',
              overflow: 'auto',
              boxShadow: '0 25px 50px rgba(0,0,0,0.25)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div style={{
              padding: '24px',
              borderBottom: '1px solid #e2e8f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              position: 'sticky',
              top: 0,
              backgroundColor: 'white',
              zIndex: 1,
            }}>
              <h3 style={{ fontSize: '20px', fontWeight: 600, color: '#0f172a', margin: 0 }}>
                {experienceModal.editingIndex !== null ? 'Modifier l\'expérience' : 'Nouvelle expérience'}
              </h3>
              <button
                type="button"
                onClick={closeExperienceModal}
                style={{
                  padding: '8px',
                  backgroundColor: '#f1f5f9',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '18px',
                  lineHeight: 1,
                }}
              >
                ✕
              </button>
            </div>

            {/* Body */}
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Type */}
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#475569', marginBottom: '8px' }}>
                  Type d'expérience *
                </label>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {[
                    { value: 'show', label: 'Show', desc: 'Défilés, Fashion Week', color: '#6366f1' },
                    { value: 'credit', label: 'Credit', desc: 'Films, Séries, Pubs', color: '#f59e0b' },
                    { value: 'collab', label: 'Collab', desc: 'Collaborations marques', color: '#10b981' },
                    { value: 'campaign', label: 'Campaign', desc: 'Campagnes pub', color: '#ec4899' },
                  ].map(opt => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => updateExperienceModalData('type', opt.value)}
                      style={{
                        flex: '1 1 140px',
                        padding: '12px',
                        backgroundColor: experienceModal.data.type === opt.value ? opt.color : 'white',
                        color: experienceModal.data.type === opt.value ? 'white' : '#475569',
                        border: `2px solid ${experienceModal.data.type === opt.value ? opt.color : '#e2e8f0'}`,
                        borderRadius: '8px',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all 0.2s',
                      }}
                    >
                      <div style={{ fontWeight: 600, fontSize: '14px' }}>{opt.label}</div>
                      <div style={{ fontSize: '11px', opacity: 0.8, marginTop: '2px' }}>{opt.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Titre */}
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#475569', marginBottom: '8px' }}>
                  Titre *
                </label>
                <input
                  type="text"
                  value={experienceModal.data.title}
                  onChange={(e) => updateExperienceModalData('title', e.target.value)}
                  placeholder="Ex: Fashion Week Paris 2024"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              {/* Row: Marque + Année */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#475569', marginBottom: '8px' }}>
                    Marque / Maison
                  </label>
                  <input
                    type="text"
                    value={experienceModal.data.brand}
                    onChange={(e) => updateExperienceModalData('brand', e.target.value)}
                    placeholder="Ex: Chanel, Dior..."
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      fontSize: '14px',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#475569', marginBottom: '8px' }}>
                    Année
                  </label>
                  <input
                    type="text"
                    value={experienceModal.data.year}
                    onChange={(e) => updateExperienceModalData('year', e.target.value)}
                    placeholder="Ex: 2024"
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      fontSize: '14px',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
              </div>

              {/* Rôle */}
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#475569', marginBottom: '8px' }}>
                  Rôle / Description courte
                </label>
                <input
                  type="text"
                  value={experienceModal.data.role}
                  onChange={(e) => updateExperienceModalData('role', e.target.value)}
                  placeholder="Ex: Opening Look, Lead Actress..."
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              {/* Description */}
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#475569', marginBottom: '8px' }}>
                  Description (optionnel)
                </label>
                <textarea
                  value={experienceModal.data.description}
                  onChange={(e) => updateExperienceModalData('description', e.target.value)}
                  placeholder="Description détaillée..."
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '14px',
                    resize: 'vertical',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              {/* Images */}
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#475569', marginBottom: '8px' }}>
                  Images
                </label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => handleExperienceImageUpload(e.target.files)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px dashed #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '14px',
                    cursor: 'pointer',
                    boxSizing: 'border-box',
                  }}
                />

                {/* Preview des images */}
                {experienceModal.data.images.length > 0 && (
                  <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '16px' }}>
                    {experienceModal.data.images.map((img, idx) => {
                      const imgUrl = typeof img === 'string' ? img : URL.createObjectURL(img);
                      return (
                        <div key={idx} style={{ position: 'relative' }}>
                          <img
                            src={imgUrl}
                            alt={`Image ${idx + 1}`}
                            style={{
                              width: '100px',
                              height: '100px',
                              objectFit: 'cover',
                              borderRadius: '8px',
                              border: idx === 0 ? '3px solid #0ea5e9' : '1px solid #e2e8f0',
                            }}
                          />
                          {idx === 0 && (
                            <span style={{
                              position: 'absolute',
                              bottom: '-8px',
                              left: '50%',
                              transform: 'translateX(-50%)',
                              backgroundColor: '#0ea5e9',
                              color: 'white',
                              padding: '2px 8px',
                              borderRadius: '4px',
                              fontSize: '9px',
                              fontWeight: 700,
                              whiteSpace: 'nowrap',
                            }}>
                              COVER
                            </span>
                          )}
                          <button
                            type="button"
                            onClick={() => removeExperienceImage(idx)}
                            style={{
                              position: 'absolute',
                              top: '-6px',
                              right: '-6px',
                              width: '22px',
                              height: '22px',
                              backgroundColor: '#ef4444',
                              color: 'white',
                              border: 'none',
                              borderRadius: '50%',
                              cursor: 'pointer',
                              fontSize: '12px',
                              fontWeight: 700,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            ✕
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Position de l'image (si au moins une image) */}
              {experienceModal.data.images.length > 0 && (
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#475569', marginBottom: '8px' }}>
                    Position de l'image cover (drag & drop)
                  </label>
                  <div
                    style={{
                      width: '100%',
                      maxWidth: '400px',
                      aspectRatio: '16/9',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      border: '2px solid #0ea5e9',
                      cursor: 'grab',
                      position: 'relative',
                      margin: '0 auto',
                      userSelect: 'none',
                      backgroundColor: '#111',
                    }}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      const rect = e.currentTarget.getBoundingClientRect();
                      const startX = e.clientX;
                      const startY = e.clientY;
                      const startPosX = experienceModal.data.imagePosition.x;
                      const startPosY = experienceModal.data.imagePosition.y;

                      const handleMove = (moveE: MouseEvent) => {
                        const deltaX = (moveE.clientX - startX) / rect.width * 100;
                        const deltaY = (moveE.clientY - startY) / rect.height * 100;
                        const newX = Math.max(0, Math.min(100, startPosX - deltaX));
                        const newY = Math.max(0, Math.min(100, startPosY - deltaY));
                        updateExperienceModalData('imagePosition', { x: newX, y: newY });
                      };

                      const handleUp = () => {
                        document.removeEventListener('mousemove', handleMove);
                        document.removeEventListener('mouseup', handleUp);
                      };

                      document.addEventListener('mousemove', handleMove);
                      document.addEventListener('mouseup', handleUp);
                    }}
                  >
                    <img
                      src={typeof experienceModal.data.images[0] === 'string'
                        ? experienceModal.data.images[0]
                        : URL.createObjectURL(experienceModal.data.images[0])}
                      alt="Preview"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        objectPosition: `${experienceModal.data.imagePosition.x}% ${experienceModal.data.imagePosition.y}%`,
                        pointerEvents: 'none',
                      }}
                      draggable={false}
                    />
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: 'rgba(0,0,0,0.3)',
                      color: 'white',
                      fontSize: '12px',
                      fontWeight: 600,
                      pointerEvents: 'none',
                    }}>
                      Glissez pour repositionner
                    </div>
                  </div>
                  <p style={{ textAlign: 'center', fontSize: '12px', color: '#64748b', marginTop: '8px' }}>
                    Position: {Math.round(experienceModal.data.imagePosition.x)}% / {Math.round(experienceModal.data.imagePosition.y)}%
                  </p>
                </div>
              )}

              {/* Vidéo (optionnel) */}
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#475569', marginBottom: '8px' }}>
                  Vidéo (optionnel)
                </label>
                <input
                  type="file"
                  accept="video/*"
                  onChange={(e) => updateExperienceModalData('video', e.target.files?.[0] || null)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                  }}
                />
                {experienceModal.data.video && (
                  <p style={{ fontSize: '12px', color: '#10b981', marginTop: '8px' }}>
                    ✓ {typeof experienceModal.data.video === 'string'
                        ? 'Vidéo existante'
                        : `Vidéo: ${experienceModal.data.video.name}`}
                  </p>
                )}
              </div>
            </div>

            {/* Footer */}
            <div style={{
              padding: '20px 24px',
              borderTop: '1px solid #e2e8f0',
              display: 'flex',
              gap: '12px',
              justifyContent: 'flex-end',
              position: 'sticky',
              bottom: 0,
              backgroundColor: 'white',
            }}>
              <button
                type="button"
                onClick={closeExperienceModal}
                style={{
                  padding: '12px 24px',
                  backgroundColor: '#f1f5f9',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#475569',
                  cursor: 'pointer',
                }}
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={saveExperience}
                disabled={!experienceModal.data.title.trim()}
                style={{
                  padding: '12px 24px',
                  backgroundColor: experienceModal.data.title.trim() ? '#0ea5e9' : '#94a3b8',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: 'white',
                  cursor: experienceModal.data.title.trim() ? 'pointer' : 'not-allowed',
                }}
              >
                {experienceModal.editingIndex !== null ? 'Enregistrer' : 'Ajouter'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

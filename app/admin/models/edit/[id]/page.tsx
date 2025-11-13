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
    // Type de talent (nouveau)
    type: 'MODELS' as 'MODELS' | 'ACTING' | 'PROMO' | 'DETAILS',

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
  });

  // Preview URLs for images
  const [previews, setPreviews] = useState<{[key: string]: string}>({});

  // Stocker les URLs existantes (pour ne pas les re-uploader)
  const [existingImages, setExistingImages] = useState<{ [key: string]: string | string[] }>({});

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
          name: model.name || '',
          category: model.category || 'woman',
          status: model.status || 'active',

          // Images communes
          mainImage: null,
          hoverImage: null,
          heroVideo: null,
          heroImage: null,
          galleryImages: [],

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

    const formData = new FormData();
    formData.append('file', fileToUpload);
    formData.append('type', type);
    formData.append('category', 'models');

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      console.error('Upload error details:', errorData);
      console.error('File details:', { name: file.name, type: file.type, size: file.size });
      throw new Error(`Upload failed: ${errorData.error || 'Unknown error'}`);
    }

    const data = await response.json();
    return data.filePath;
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

  // Step 0: Sélection du type de talent
  const renderStep0 = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#0f172a', marginBottom: '8px' }}>
        Type de talent
      </h3>

      <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '16px' }}>
        Type actuel: {formData.type}
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
        {[
          { value: 'MODELS', label: 'Models', desc: 'Mannequins mode (Woman/Man)' },
          { value: 'ACTING', label: 'Acting', desc: 'Acteurs (Commercial/Cinéma/Théâtre)' },
          { value: 'PROMO', label: 'Promo', desc: 'Ambassadeurs & Influenceurs' },
          { value: 'DETAILS', label: 'Details', desc: 'Modèles parties du corps' },
        ].map((type) => (
          <button
            key={type.value}
            type="button"
            onClick={() => {
              setFormData(prev => ({
                ...prev,
                type: type.value as 'MODELS' | 'ACTING' | 'PROMO' | 'DETAILS',
                // Reset category based on type
                category: type.value === 'MODELS' ? 'woman' :
                         type.value === 'ACTING' ? 'commercial' :
                         type.value === 'DETAILS' ? 'hands' : ''
              }));
            }}
            style={{
              padding: '24px',
              border: formData.type === type.value ? '2px solid #3b82f6' : '2px solid #e2e8f0',
              borderRadius: '12px',
              background: formData.type === type.value ? '#eff6ff' : 'white',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.2s',
            }}
          >
            <div style={{ fontSize: '16px', fontWeight: 600, color: '#0f172a', marginBottom: '8px' }}>
              {type.label}
            </div>
            <div style={{ fontSize: '13px', color: '#64748b' }}>
              {type.desc}
            </div>
          </button>
        ))}
      </div>
    </div>
  );

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

  const renderStep2 = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#0f172a', marginBottom: '8px' }}>
        Images principales
      </h3>

      <div>
        <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#475569', marginBottom: '8px' }}>
          {formData.type === 'PROMO' || formData.type === 'ACTING' || formData.type === 'DETAILS' ? 'Image principale - Pour listes *' : 'Image principale *'} <span style={{ color: '#ef4444' }}>requis</span>
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => e.target.files && handleFileChange('mainImage', e.target.files[0])}
          style={{
            width: '100%',
            padding: '10px 12px',
            border: '1px solid #e2e8f0',
            borderRadius: '6px',
            fontSize: '14px',
          }}
        />
        {previews.mainImage && (
          <div style={{ marginTop: '12px', position: 'relative', display: 'inline-block' }}>
            <img src={previews.mainImage} alt="Preview" style={{ maxWidth: '200px', borderRadius: '6px', display: 'block' }} />
            <button
              type="button"
              onClick={() => removeFile('mainImage')}
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
          {formData.type === 'PROMO' || formData.type === 'ACTING' || formData.type === 'DETAILS' ? 'Image au survol (Hover) - Pour listes' : 'Image au survol (Hover)'}
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => e.target.files && handleFileChange('hoverImage', e.target.files[0])}
          style={{
            width: '100%',
            padding: '10px 12px',
            border: '1px solid #e2e8f0',
            borderRadius: '6px',
            fontSize: '14px',
          }}
        />
        {previews.hoverImage && (
          <div style={{ marginTop: '12px', position: 'relative', display: 'inline-block' }}>
            <img src={previews.hoverImage} alt="Preview" style={{ maxWidth: '200px', borderRadius: '6px', display: 'block' }} />
            <button
              type="button"
              onClick={() => removeFile('hoverImage')}
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

      {/* Hero Image pour MODELS, PROMO, ACTING et DETAILS */}
      {(formData.type === 'MODELS' || formData.type === 'PROMO' || formData.type === 'ACTING' || formData.type === 'DETAILS') && (
        <div>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#475569', marginBottom: '8px' }}>
            Image Hero - Pour section HERO (optionnel)
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => e.target.files && handleFileChange('heroImage', e.target.files[0])}
            style={{
              width: '100%',
              padding: '10px 12px',
              border: '1px solid #e2e8f0',
              borderRadius: '6px',
              fontSize: '14px',
            }}
          />
          {previews.heroImage && (
            <div style={{ marginTop: '12px', position: 'relative', display: 'inline-block' }}>
              <img src={previews.heroImage} alt="Preview" style={{ maxWidth: '200px', borderRadius: '6px', display: 'block' }} />
              <button
                type="button"
                onClick={() => removeFile('heroImage')}
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

      {/* Hero Video pour MODELS, ACTING, PROMO */}
      {formData.type !== 'DETAILS' && (
        <div>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#475569', marginBottom: '8px' }}>
            {formData.type === 'PROMO' || formData.type === 'ACTING' ? 'Vidéo Hero - Pour section HERO (optionnel, alternative à Image Hero)' : 'Vidéo Hero (optionnel)'}
          </label>
          <input
            type="file"
            accept="video/*"
            onChange={(e) => e.target.files && handleFileChange('heroVideo', e.target.files[0])}
            style={{
              width: '100%',
              padding: '10px 12px',
              border: '1px solid #e2e8f0',
              borderRadius: '6px',
              fontSize: '14px',
            }}
          />
          {formData.heroVideo && (
            <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <p style={{ fontSize: '13px', color: '#10b981' }}>
                ✓ Vidéo sélectionnée : {formData.heroVideo.name}
              </p>
              <button
                type="button"
                onClick={() => removeFile('heroVideo')}
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
    </div>
  );

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
    const typeSpecificFields = {
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
        { key: 'waist', label: 'Waist', placeholder: '65cm' },
        { key: 'hips', label: 'Hips', placeholder: '90cm' },
        { key: 'bust', label: 'Bust', placeholder: '85cm' },
        { key: 'skinTone', label: 'Skin Tone', placeholder: 'Medium' },
        { key: 'faceSpecialty', label: 'Face Specialty (comma separated)', placeholder: 'Expressive eyes, High cheekbones' },
      ],
    };

    const fieldsToDisplay = [...commonFields, ...typeSpecificFields[formData.type]];

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#0f172a', marginBottom: '8px' }}>
          Mensurations & Informations
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
          {fieldsToDisplay.map(field => (
            <div key={field.key}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#475569', marginBottom: '8px' }}>
                {field.label}
              </label>
              <input
                type={(field as any).type || 'text'}
                value={formData[field.key as keyof typeof formData] as string}
                onChange={(e) => {
                  const value = (field as any).type === 'number' ? parseInt(e.target.value) || '' : e.target.value;
                  setFormData(prev => ({ ...prev, [field.key]: value }));
                }}
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
                placeholder={field.placeholder}
              />
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderStep6 = () => (
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
        <p style={{ fontSize: '14px', color: '#475569', marginTop: '8px' }}>
          <strong>Type:</strong> {formData.type}
        </p>
        <p style={{ fontSize: '14px', color: '#475569', marginTop: '8px' }}>
          <strong>Catégorie:</strong> {formData.category}
        </p>
        <p style={{ fontSize: '14px', color: '#475569', marginTop: '8px' }}>
          <strong>Statut:</strong> {formData.status}
        </p>
      </div>
    </div>
  );

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
    </div>
  );
}

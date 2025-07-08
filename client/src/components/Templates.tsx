import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ShoppingCart, 
  MessageSquare, 
  Heart, 
  Book, 
  Calendar, 
  DollarSign,
  Camera,
  Music,
  MapPin,
  Gamepad2,
  Rocket,
  Copy,
  Star,
  Users,
  Clock
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Platform } from "@/lib/types";

interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  estimatedTime: string;
  popularity: number;
  icon: React.ReactNode;
  features: string[];
  techStack: string[];
  prompt: string;
  bestPlatforms: Platform[];
  tags: string[];
}

interface TemplatesProps {
  onUseTemplate: (prompt: string, platform: Platform) => void;
}

export function Templates({ onUseTemplate }: TemplatesProps) {
  const { toast } = useToast();

  const templates: Template[] = [
    {
      id: "ecommerce",
      name: "E-commerce Platform",
      description: "Complete online store with cart, payments, and inventory management",
      category: "Business",
      difficulty: "Advanced",
      estimatedTime: "6-8 weeks",
      popularity: 95,
      icon: <ShoppingCart className="w-6 h-6 text-green-600" />,
      features: ["Product catalog", "Shopping cart", "Payment processing", "User accounts", "Admin dashboard", "Order tracking"],
      techStack: ["React/Next.js", "Node.js", "PostgreSQL", "Stripe", "Tailwind CSS", "Redis"],
      bestPlatforms: ["replit", "cursor", "windsurf"],
      tags: ["popular", "complex", "monetizable"],
      prompt: `Build a comprehensive e-commerce platform with the following requirements:

CORE FUNCTIONALITY:
- Product catalog with categories, search, and filtering
- Shopping cart with persistent sessions
- User registration and authentication system
- Payment processing with Stripe integration
- Order management and tracking system
- Inventory management for sellers
- Admin dashboard for product and order management
- Customer reviews and ratings system
- Email notifications for orders and updates
- Mobile-responsive design

TECHNICAL REQUIREMENTS:
- Frontend: React.js with TypeScript and Tailwind CSS
- Backend: Node.js with Express.js API
- Database: PostgreSQL with proper indexing
- Authentication: JWT tokens with refresh mechanism
- Payment: Stripe for secure payment processing
- File storage: Cloud storage for product images
- Email: Transactional email service integration
- Search: Full-text search with filters and sorting
- Caching: Redis for session management and cart persistence
- Security: Input validation, CSRF protection, rate limiting

BUSINESS FEATURES:
- Multi-vendor marketplace capability
- Discount codes and promotional campaigns
- Abandoned cart recovery emails
- Product recommendations engine
- Analytics dashboard for sales tracking
- SEO optimization for product pages
- Social media integration for sharing
- Wishlist and favorites functionality
- Guest checkout option
- Multiple payment methods support

TARGET AUDIENCE: Small to medium businesses wanting to sell products online
SCALE: Support for 10,000+ products and 1,000+ concurrent users
DEPLOYMENT: Cloud-ready with environment configurations`
    },
    {
      id: "social-media",
      name: "Social Media App",
      description: "Twitter-like platform with posts, follows, and real-time chat",
      category: "Social",
      difficulty: "Advanced",
      estimatedTime: "5-7 weeks",
      popularity: 92,
      icon: <MessageSquare className="w-6 h-6 text-blue-600" />,
      features: ["User profiles", "Posts & feeds", "Real-time chat", "Follow system", "Notifications", "Media uploads"],
      techStack: ["React", "WebSocket", "Node.js", "MongoDB", "Socket.io", "Cloudinary"],
      bestPlatforms: ["cursor", "windsurf", "replit"],
      tags: ["trending", "real-time", "social"],
      prompt: `Create a modern social media platform with comprehensive social features:

CORE FEATURES:
- User registration and profile management with avatar uploads
- Post creation with text, images, and video support
- Real-time news feed with chronological and algorithmic sorting
- Follow/unfollow system with follower/following lists
- Like, comment, and share functionality on posts
- Real-time direct messaging between users
- Notification system for interactions and mentions
- Search functionality for users and posts
- Hashtag system with trending topics
- Story feature with 24-hour expiration

TECHNICAL IMPLEMENTATION:
- Frontend: React.js with TypeScript and modern hooks
- Real-time: WebSocket connections with Socket.io
- Backend: Node.js with Express.js RESTful API
- Database: MongoDB for flexible document storage
- File uploads: Cloudinary for image and video processing
- Authentication: JWT with social login options
- State management: Redux Toolkit or Zustand
- UI: Tailwind CSS with responsive design
- Performance: Virtual scrolling for large feeds

ADVANCED FEATURES:
- Content moderation tools and reporting system
- Privacy settings for posts and profiles
- Dark/light theme support
- Push notifications for mobile users
- Analytics dashboard for user engagement
- Content recommendation algorithm
- Live streaming capability
- Group creation and management
- Event creation and RSVP system
- Advanced search with filters

TARGET AUDIENCE: General public aged 16-45 interested in social networking
SCALE: Support for 50,000+ users with real-time interactions
PERFORMANCE: Sub-200ms response times for feeds and messaging`
    },
    {
      id: "dating-app",
      name: "Dating App",
      description: "Tinder-style dating app with swipe mechanics and matching",
      category: "Social",
      difficulty: "Advanced",
      estimatedTime: "4-6 weeks",
      popularity: 88,
      icon: <Heart className="w-6 h-6 text-pink-600" />,
      features: ["Swipe interface", "Matching system", "Chat messaging", "Profile photos", "Location-based", "Premium features"],
      techStack: ["React Native", "Node.js", "PostgreSQL", "WebSocket", "Geolocation", "Stripe"],
      bestPlatforms: ["replit", "cursor", "lovable"],
      tags: ["mobile", "geolocation", "popular"],
      prompt: `Develop a modern dating application with swipe-based matching:

CORE FUNCTIONALITY:
- User registration with photo verification
- Detailed profile creation with interests and preferences
- Swipe-based discovery interface (like/pass mechanism)
- Mutual matching system with instant notifications
- Real-time chat messaging between matches
- Location-based user discovery with distance preferences
- Photo upload and verification system
- Age and distance filtering options
- Report and block functionality for safety
- Premium subscription features

TECHNICAL STACK:
- Mobile: React Native or Progressive Web App
- Frontend: React.js with gesture handling for swipes
- Backend: Node.js with Express.js API
- Database: PostgreSQL with geographic queries
- Real-time: WebSocket for instant messaging
- Location: Geolocation API with privacy controls
- Images: Cloud storage with compression and CDN
- Payments: Stripe for premium subscriptions
- Security: Photo verification and content moderation

MATCHING ALGORITHM:
- Preference-based filtering (age, distance, interests)
- Activity scoring to promote active users
- Compatibility scoring based on shared interests
- Boost feature for premium users
- Daily like limits with premium unlimited
- Super like feature for special interest
- Mutual friend detection through social integration
- Behavioral analytics for better matching

SAFETY & PRIVACY:
- Photo verification to prevent fake profiles
- Report and block system with admin review
- Privacy controls for location sharing
- Secure messaging with encryption
- Profile visibility controls
- Safety tips and guidelines
- Integration with emergency services if needed

TARGET AUDIENCE: Adults 18-50 looking for romantic connections
MONETIZATION: Freemium model with premium features
SCALE: Support for 100,000+ active users with real-time matching`
    },
    {
      id: "learning-platform",
      name: "Learning Management System",
      description: "Educational platform with courses, quizzes, and progress tracking",
      category: "Education",
      difficulty: "Advanced",
      estimatedTime: "7-9 weeks",
      popularity: 85,
      icon: <Book className="w-6 h-6 text-purple-600" />,
      features: ["Course creation", "Video lessons", "Quizzes & assignments", "Progress tracking", "Certificates", "Discussion forums"],
      techStack: ["Next.js", "Node.js", "PostgreSQL", "Video streaming", "PDF generation", "Payment processing"],
      bestPlatforms: ["replit", "windsurf"],
      tags: ["educational", "content-rich", "comprehensive"],
      prompt: `Build a comprehensive Learning Management System (LMS) for online education:

CORE FEATURES:
- Course creation and management system for instructors
- Video lesson delivery with adaptive streaming
- Interactive quizzes and assignments with auto-grading
- Progress tracking and analytics for students
- Certificate generation upon course completion
- Discussion forums for each course
- Student-instructor messaging system
- Course search and recommendation engine
- Multiple content types: videos, PDFs, text, interactive elements
- Mobile-responsive learning interface

INSTRUCTOR TOOLS:
- Course builder with drag-and-drop lesson organization
- Video upload and processing with automatic transcription
- Quiz and assignment creation tools
- Student progress monitoring dashboard
- Grade book and feedback system
- Revenue tracking and payout management
- Content library for reusable materials
- Live session scheduling and virtual classroom
- Bulk student management and communication tools

STUDENT EXPERIENCE:
- Personalized learning dashboard
- Course catalog with filtering and search
- Bookmark and note-taking functionality
- Offline content download for mobile learning
- Study schedule and reminder system
- Achievement badges and gamification
- Peer interaction through forums and study groups
- Progress visualization and goal setting
- Mobile app for learning on the go

TECHNICAL IMPLEMENTATION:
- Frontend: Next.js with TypeScript and server-side rendering
- Backend: Node.js with Express.js API architecture
- Database: PostgreSQL with complex relational data
- Video: CDN with adaptive bitrate streaming
- Real-time: WebSocket for live sessions and chat
- Payments: Stripe for course purchases and instructor payouts
- Search: Elasticsearch for content discovery
- Analytics: Comprehensive tracking for learning insights
- Security: Role-based access control and content protection

TARGET AUDIENCE: Educational institutions, individual instructors, and corporate training
SCALE: Support for 10,000+ concurrent students and unlimited courses
COMPLIANCE: SCORM compatibility and accessibility standards`
    },
    {
      id: "task-manager",
      name: "Project Management Tool",
      description: "Comprehensive project management with teams, tasks, and timelines",
      category: "Productivity",
      difficulty: "Intermediate",
      estimatedTime: "4-5 weeks",
      popularity: 90,
      icon: <Calendar className="w-6 h-6 text-orange-600" />,
      features: ["Task management", "Team collaboration", "Gantt charts", "Time tracking", "File sharing", "Reports"],
      techStack: ["React", "Node.js", "PostgreSQL", "WebSocket", "File storage", "Chart.js"],
      bestPlatforms: ["replit", "cursor"],
      tags: ["productivity", "teams", "business"],
      prompt: `Create a comprehensive project management platform for teams:

CORE PROJECT MANAGEMENT:
- Project creation and workspace organization
- Task creation with priorities, deadlines, and assignments
- Kanban boards with drag-and-drop functionality
- Gantt charts for timeline visualization
- Milestone tracking and project phases
- Dependency management between tasks
- Time tracking with automatic and manual entry
- Resource allocation and workload balancing
- Project templates for quick setup
- Custom fields and task types

TEAM COLLABORATION:
- Team member invitation and role management
- Real-time collaboration on tasks and projects
- Comment system with mentions and notifications
- File sharing and document collaboration
- Team calendar with shared events and deadlines
- Discussion boards for project communication
- Video call integration for remote meetings
- Screen sharing and collaborative whiteboarding
- Activity feeds for project updates
- Email notifications and daily/weekly digests

REPORTING AND ANALYTICS:
- Project progress dashboards with visual charts
- Time tracking reports and productivity analytics
- Burndown charts and velocity tracking
- Resource utilization reports
- Custom report builder with filters
- Export capabilities (PDF, Excel, CSV)
- Budget tracking and cost analysis
- Performance metrics for teams and individuals
- Deadline tracking and risk assessment
- Client reporting and project summaries

TECHNICAL REQUIREMENTS:
- Frontend: React.js with TypeScript and modern UI
- Backend: Node.js with Express.js RESTful API
- Database: PostgreSQL with complex queries and indexing
- Real-time: WebSocket for live collaboration
- File storage: Cloud storage with version control
- Authentication: Multi-factor authentication and SSO
- Charts: Chart.js or D3.js for data visualization
- Mobile: Progressive Web App for mobile access
- Integration: REST API for third-party tool connections
- Security: Role-based permissions and data encryption

TARGET AUDIENCE: Small to large teams, agencies, and enterprises
INTEGRATIONS: Slack, Google Workspace, Microsoft 365, GitHub
SCALE: Support for 1,000+ users per workspace with unlimited projects`
    },
    {
      id: "fintech-app",
      name: "Personal Finance Tracker",
      description: "Comprehensive finance app with budgeting, investments, and analytics",
      category: "Finance",
      difficulty: "Advanced",
      estimatedTime: "6-8 weeks",
      popularity: 82,
      icon: <DollarSign className="w-6 h-6 text-green-600" />,
      features: ["Account linking", "Budget tracking", "Investment portfolio", "Bill reminders", "Financial reports", "Goal setting"],
      techStack: ["React", "Node.js", "PostgreSQL", "Plaid API", "Chart.js", "Encryption"],
      bestPlatforms: ["cursor", "windsurf"],
      tags: ["financial", "secure", "analytics"],
      prompt: `Build a comprehensive personal finance management application:

ACCOUNT MANAGEMENT:
- Bank account integration using Plaid API for secure connectivity
- Credit card and investment account linking
- Transaction categorization with machine learning
- Manual transaction entry for cash and crypto
- Multi-currency support for international users
- Account balance tracking and synchronization
- Transaction search and filtering capabilities
- Duplicate transaction detection and merging
- Account reconciliation tools
- Financial institution data encryption

BUDGETING AND PLANNING:
- Customizable budget creation with category limits
- Income and expense tracking with visual charts
- Budget vs actual spending analysis
- Bill reminder system with automatic notifications
- Recurring transaction detection and management
- Spending pattern analysis and insights
- Budget goal setting and progress tracking
- Emergency fund calculator and recommendations
- Debt payoff planner with optimization strategies
- Savings goal tracking with automated transfers

INVESTMENT TRACKING:
- Portfolio performance monitoring across accounts
- Stock, bond, and crypto tracking with real-time prices
- Asset allocation analysis and rebalancing suggestions
- Investment goal planning for retirement and major purchases
- Tax-loss harvesting opportunities identification
- Dividend tracking and reinvestment calculations
- Risk assessment and portfolio diversification analysis
- Investment news and market updates integration
- Performance benchmarking against market indices
- Cost basis tracking for tax reporting

REPORTS AND ANALYTICS:
- Monthly and yearly financial reports with trends
- Net worth tracking with historical charts
- Cash flow analysis and forecasting
- Tax preparation assistance with categorized deductions
- Custom report builder with date range filtering
- Data export capabilities for accountants
- Financial health score calculation
- Spending category breakdowns with insights
- Income vs expense trending analysis
- Goal progress visualization with projections

TECHNICAL IMPLEMENTATION:
- Frontend: React.js with TypeScript and responsive design
- Backend: Node.js with Express.js and secure API design
- Database: PostgreSQL with encrypted financial data storage
- Security: Bank-level encryption, 2FA, and audit logging
- Integration: Plaid for banking, Alpha Vantage for market data
- Charts: Chart.js for interactive financial visualizations
- Mobile: Progressive Web App with offline capabilities
- Compliance: PCI DSS and financial data protection standards

TARGET AUDIENCE: Individuals and families managing personal finances
SECURITY: Bank-level security with SOC 2 compliance
SCALE: Support for 100,000+ users with real-time data synchronization`
    },
    {
      id: "photo-sharing",
      name: "Photo Sharing Platform",
      description: "Instagram-like app with photo filters, stories, and social features",
      category: "Social",
      difficulty: "Intermediate",
      estimatedTime: "4-6 weeks",
      popularity: 78,
      icon: <Camera className="w-6 h-6 text-indigo-600" />,
      features: ["Photo uploads", "Filters & editing", "Stories", "Following system", "Comments & likes", "Discover feed"],
      bestPlatforms: ["replit", "lovable", "cursor"],
      tags: ["visual", "social", "creative"],
      prompt: `Create a modern photo sharing platform with social networking features:

PHOTO FEATURES:
- High-quality photo upload with automatic compression
- Built-in photo editor with filters, cropping, and adjustments
- Multiple photo posts (carousel functionality)
- Story feature with 24-hour expiration
- Photo tagging of users and locations
- Advanced camera integration for web and mobile
- Collage and layout creation tools
- Photo backup and cloud storage
- Download and sharing capabilities
- Privacy controls for photo visibility

SOCIAL NETWORKING:
- User profiles with bio, follower count, and photo grid
- Follow/unfollow system with mutual connections
- Like and comment system with real-time updates
- Direct messaging with photo sharing
- Discover feed with algorithmic content recommendations
- Hashtag system for content discovery
- User mentions in captions and comments
- Content reporting and moderation tools
- Blocking and privacy settings
- Activity feed for user interactions

CONTENT CREATION:
- Multiple photo upload with batch processing
- Video story support with basic editing
- Boomerang and time-lapse features
- Text overlays and stickers for stories
- Music integration for story enhancement
- Location tagging with map integration
- Photo challenge and contest features
- Brand partnership and sponsored content tools
- Advanced analytics for content creators
- Content scheduling and drafts

TECHNICAL ARCHITECTURE:
- Frontend: React.js with responsive design and PWA capabilities
- Backend: Node.js with Express.js RESTful API
- Database: MongoDB for flexible content and user data
- Media: Cloudinary for image processing and CDN delivery
- Real-time: WebSocket for live comments and notifications
- Image processing: Canvas API for filters and editing
- Search: Elasticsearch for content and user discovery
- Mobile: React Native or PWA for mobile experience
- Security: Content moderation and user safety features

DISCOVERY AND ENGAGEMENT:
- Explore page with trending content and recommendations
- Advanced search with filters for users, hashtags, and locations
- Trending hashtags and topics
- Featured content and creator spotlights
- Push notifications for interactions and new content
- Email digest with weekly highlights
- Integration with other social platforms for cross-posting
- Analytics dashboard for content performance
- Advertising platform for promoted posts

TARGET AUDIENCE: Creative individuals, photographers, and content creators
MONETIZATION: Advertising, premium filters, and creator tools
SCALE: Support for millions of photos with fast delivery worldwide`
    },
    {
      id: "music-streaming",
      name: "Music Streaming Service",
      description: "Spotify-like platform with playlists, recommendations, and social features",
      category: "Entertainment",
      difficulty: "Advanced",
      estimatedTime: "8-10 weeks",
      popularity: 75,
      icon: <Music className="w-6 h-6 text-red-600" />,
      features: ["Music streaming", "Playlists", "Music discovery", "Artist profiles", "Offline mode", "Social sharing"],
      techStack: ["React", "Node.js", "PostgreSQL", "Audio streaming", "ML recommendations", "CDN"],
      bestPlatforms: ["cursor", "windsurf"],
      tags: ["audio", "streaming", "entertainment"],
      prompt: `Develop a comprehensive music streaming platform with advanced features:

MUSIC STREAMING CORE:
- High-quality audio streaming with adaptive bitrate
- Extensive music library management and organization
- Artist, album, and track metadata with rich information
- Audio player with standard controls and queue management
- Playlist creation and collaborative playlist features
- Music search with filters for genre, artist, year, mood
- Offline download capability for premium users
- Cross-device synchronization and seamless handoff
- Gapless playback for album listening experience
- Audio format support (MP3, FLAC, AAC) with quality options

DISCOVERY AND RECOMMENDATIONS:
- Machine learning-powered music recommendation engine
- Personalized daily mixes based on listening history
- Discover Weekly with new music suggestions
- Radio stations based on artists, genres, or songs
- Trending charts and popular music discovery
- Music discovery through social connections
- Mood-based playlists and activity recommendations
- New release notifications for followed artists
- Similar artist and song recommendations
- Genre exploration with curated playlists

SOCIAL FEATURES:
- User profiles with music taste and listening statistics
- Friend system with music sharing and recommendations
- Collaborative playlists with real-time editing
- Music sharing to social media platforms
- Activity feed showing friends' listening activity
- Artist following with updates and new releases
- Concert and event discovery based on musical taste
- Music reviews and rating system
- Community playlists and user-generated content
- Live listening parties and synchronized playback

ARTIST AND CONTENT MANAGEMENT:
- Artist dashboard with analytics and fan insights
- Music upload and distribution system for independent artists
- Royalty tracking and payment processing
- Podcast hosting and distribution capabilities
- Audiobook integration with bookmark and chapter support
- Exclusive content and early access for premium users
- Artist verification and profile management
- Concert and tour date integration
- Merchandise integration and sales
- Fan engagement tools and direct communication

TECHNICAL IMPLEMENTATION:
- Frontend: React.js with TypeScript and modern audio APIs
- Backend: Node.js with Express.js and microservices architecture
- Database: PostgreSQL for user data, MongoDB for music metadata
- Audio: CDN with global distribution for fast streaming
- ML: Python-based recommendation engine with collaborative filtering
- Real-time: WebSocket for live listening sessions
- Mobile: React Native for iOS and Android applications
- Analytics: Comprehensive tracking for user behavior and music trends
- Security: DRM protection and content licensing compliance
- Payment: Subscription management with multiple tiers

TARGET AUDIENCE: Music enthusiasts, casual listeners, and independent artists
LICENSING: Music industry partnerships and royalty management
SCALE: Support for millions of tracks and concurrent streaming users`
    },
    {
      id: "travel-planner",
      name: "Travel Planning App",
      description: "Complete travel companion with itineraries, bookings, and local guides",
      category: "Travel",
      difficulty: "Advanced",
      estimatedTime: "6-8 weeks",
      popularity: 80,
      icon: <MapPin className="w-6 h-6 text-blue-600" />,
      features: ["Trip planning", "Hotel booking", "Flight search", "Local recommendations", "Itinerary sharing", "Expense tracking"],
      techStack: ["React", "Node.js", "PostgreSQL", "Maps API", "Payment processing", "Geolocation"],
      bestPlatforms: ["replit", "lovable"],
      tags: ["location-based", "comprehensive", "booking"],
      prompt: `Create a comprehensive travel planning and booking platform:

TRIP PLANNING:
- Interactive trip builder with drag-and-drop itinerary creation
- Destination research with detailed guides and recommendations
- Multi-city trip planning with optimal route suggestions
- Budget planning tools with cost estimation for destinations
- Travel date optimization based on weather and events
- Group trip planning with collaborative features
- Travel style preferences (adventure, luxury, budget, family)
- Packing checklist generator based on destination and activities
- Travel document management and expiration reminders
- Emergency contact and travel insurance integration

BOOKING AND RESERVATIONS:
- Flight search and booking with price comparison
- Hotel and accommodation booking with detailed reviews
- Car rental integration with pickup/dropoff coordination
- Activity and tour booking with local operators
- Restaurant reservations with dietary preference filtering
- Travel insurance purchase and management
- Visa and travel document assistance
- Currency exchange rate tracking and alerts
- Travel deals and discount discovery
- Last-minute booking options with flexible dates

LOCAL EXPERIENCES:
- Local guide recommendations with verified reviews
- Hidden gem discovery through community contributions
- Cultural event and festival calendar integration
- Food and dining recommendations with dietary filters
- Shopping and souvenir guide with local markets
- Transportation options (public transit, taxi, bike rentals)
- Safety tips and local customs information
- Language translation and phrase book integration
- Weather forecasting with activity recommendations
- Emergency services and healthcare information

TRAVEL COMPANION:
- Offline map access with downloaded content
- Real-time flight status and gate change notifications
- Hotel check-in and room service through the app
- Expense tracking with receipt scanning and categorization
- Travel journal with photo and note capabilities
- Trip sharing with friends and family
- Social features for connecting with fellow travelers
- Travel milestone tracking and achievement system
- Post-trip review and rating system
- Travel memory book creation and sharing

TECHNICAL FEATURES:
- Frontend: React.js with responsive design and offline capabilities
- Backend: Node.js with Express.js and third-party API integrations
- Database: PostgreSQL with geospatial data support
- Maps: Google Maps API with custom markers and routes
- Payments: Secure booking with multiple payment options
- Location: GPS tracking with privacy controls
- Real-time: Push notifications for travel updates
- Mobile: Progressive Web App with native app features
- Analytics: Travel pattern analysis and personalization
- Security: Secure document storage and data encryption

INTEGRATIONS:
- Airlines APIs for real-time flight information
- Hotel booking platforms (Booking.com, Expedia)
- Activity providers (Viator, GetYourGuide)
- Transportation (Uber, local transit systems)
- Weather services for accurate forecasting
- Currency exchange APIs for real-time rates
- Travel advisory and safety information sources

TARGET AUDIENCE: Leisure and business travelers, travel agencies, and local businesses
MONETIZATION: Booking commissions, premium features, and local business partnerships
SCALE: Support for global destinations with multi-language support`
    },
    {
      id: "gaming-platform",
      name: "Gaming Community Platform",
      description: "Discord-like platform for gamers with voice chat, tournaments, and streaming",
      category: "Gaming",
      difficulty: "Advanced",
      estimatedTime: "8-10 weeks",
      popularity: 73,
      icon: <Gamepad2 className="w-6 h-6 text-purple-600" />,
      features: ["Voice chat", "Text channels", "Game integration", "Tournaments", "Streaming", "Guild system"],
      techStack: ["React", "Node.js", "WebRTC", "WebSocket", "PostgreSQL", "Video streaming"],
      bestPlatforms: ["cursor", "windsurf"],
      tags: ["gaming", "real-time", "community"],
      prompt: `Build a comprehensive gaming community platform with social and competitive features:

COMMUNICATION FEATURES:
- Voice chat rooms with high-quality audio and low latency
- Text channels organized by game, topic, or guild
- Direct messaging with file sharing and emoji reactions
- Screen sharing for game tutorials and troubleshooting
- Video calls for team strategy sessions
- Voice channel moderation tools and permissions
- Message history with search and pinning capabilities
- Rich media embedding (images, videos, links)
- Bot integration system for custom commands
- Multi-language support with real-time translation

GAMING INTEGRATION:
- Game library integration with Steam, Epic, Xbox, PlayStation
- Rich presence showing current game status and activity
- Achievement sharing and progress tracking
- Game session coordination and party formation
- Game-specific channels and communities
- Leaderboard integration with competitive rankings
- Match history tracking and statistics
- Gaming calendar with release dates and events
- Game recommendation engine based on friend activity
- Cross-platform gaming support and coordination

COMMUNITY AND GUILDS:
- Guild creation and management with hierarchical roles
- Guild events and tournament organization
- Community forums with threaded discussions
- User reputation system with badges and achievements
- Mentorship programs pairing experienced with new players
- Community challenges and seasonal events
- Content creation tools for guides and tutorials
- Fan art and screenshot sharing galleries
- Gaming news and update aggregation
- Developer and publisher official channels

COMPETITIVE FEATURES:
- Tournament bracket creation and management
- Automated tournament registration and check-in
- Match scheduling with time zone coordination
- Prize pool management and distribution
- Live tournament streaming integration
- Spectator mode for watching competitive matches
- Coaching and analysis tools for improvement
- Team formation and recruitment system
- Scrim scheduling and practice match coordination
- Performance analytics and improvement tracking

STREAMING AND CONTENT:
- Live streaming integration with Twitch and YouTube
- Clip creation and sharing from streams
- Stream discovery based on games and interests
- Stream scheduling and notification system
- Donation and subscription management for streamers
- Stream overlay integration with platform features
- VOD (Video on Demand) hosting and sharing
- Highlight reel creation and editing tools
- Content creator verification and partner program
- Copyright and content moderation tools

TECHNICAL ARCHITECTURE:
- Frontend: React.js with TypeScript and real-time updates
- Backend: Node.js with microservices for scalability
- Real-time: WebSocket for instant messaging and notifications
- Voice/Video: WebRTC for peer-to-peer communication
- Database: PostgreSQL for user data, Redis for sessions
- CDN: Global content delivery for media and files
- Gaming APIs: Integration with major gaming platforms
- Mobile: React Native for mobile gaming communities
- Security: End-to-end encryption for private communications
- Moderation: AI-powered content filtering and human oversight

TARGET AUDIENCE: Gamers of all skill levels, esports teams, content creators
MONETIZATION: Premium subscriptions, tournament entry fees, creator partnerships
SCALE: Support for millions of users with global server infrastructure`
    }
  ];

  const categories = ["All", "Business", "Social", "Education", "Productivity", "Finance", "Entertainment", "Travel", "Gaming"];

  const handleCopyPrompt = async (prompt: string) => {
    try {
      await navigator.clipboard.writeText(prompt);
      toast({
        title: "Prompt copied",
        description: "Template prompt has been copied to your clipboard.",
      });
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Failed to copy prompt to clipboard.",
        variant: "destructive",
      });
    }
  };

  const handleUseTemplate = (template: Template) => {
    const bestPlatform = template.bestPlatforms[0];
    onUseTemplate(template.prompt, bestPlatform);
    toast({
      title: "Template loaded",
      description: `${template.name} template has been loaded into the generator.`,
    });
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner": return "bg-green-100 text-green-800";
      case "Intermediate": return "bg-yellow-100 text-yellow-800";
      case "Advanced": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const filteredTemplates = (category: string) => {
    if (category === "All") return templates;
    return templates.filter(template => template.category === category);
  };

  return (
    <div className="w-full">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">App Templates</h2>
        <p className="text-gray-600">
          Start with proven app concepts. Each template includes comprehensive requirements and technical specifications.
        </p>
      </div>

      <Tabs defaultValue="All" className="w-full">
        <TabsList className="grid grid-cols-4 lg:grid-cols-9 mb-6">
          {categories.map((category) => (
            <TabsTrigger key={category} value={category} className="text-xs">
              {category}
            </TabsTrigger>
          ))}
        </TabsList>

        {categories.map((category) => (
          <TabsContent key={category} value={category}>
            <div className="grid md:grid-cols-2 lg:grid-cols-1 gap-6">
              {filteredTemplates(category)
                .sort((a, b) => b.popularity - a.popularity)
                .map((template) => (
                <Card key={template.id} className="border border-gray-200 hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                          {template.icon}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{template.name}</h3>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge className={getDifficultyColor(template.difficulty)}>
                              {template.difficulty}
                            </Badge>
                            <div className="flex items-center text-sm text-gray-500">
                              <Clock className="w-3 h-3 mr-1" />
                              {template.estimatedTime}
                            </div>
                            <div className="flex items-center text-sm text-gray-500">
                              <Star className="w-3 h-3 mr-1 text-yellow-500" />
                              {template.popularity}%
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <p className="text-gray-600 mb-4">{template.description}</p>

                    <div className="space-y-3 mb-4">
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900 mb-2">Key Features:</h4>
                        <div className="flex flex-wrap gap-1">
                          {template.features.slice(0, 4).map((feature, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {feature}
                            </Badge>
                          ))}
                          {template.features.length > 4 && (
                            <Badge variant="secondary" className="text-xs">
                              +{template.features.length - 4} more
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-semibold text-gray-900 mb-2">Tech Stack:</h4>
                        <div className="flex flex-wrap gap-1">
                          {template.techStack.slice(0, 4).map((tech, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {tech}
                            </Badge{tech}
                            </Badge>
                          ))}
                          {template.techStack.length > 4 && (
                            <Badge variant="outline" className="text-xs">
                              +{template.techStack.length - 4} more
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-semibold text-gray-900 mb-2">Best Platforms:</h4>
                        <div className="flex space-x-2">
                          {template.bestPlatforms.map((platform, index) => (
                            <Badge key={index} variant="default" className="text-xs capitalize">
                              {platform}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button 
                        onClick={() => handleUseTemplate(template)}
                        className="flex-1"
                      >
                        <Rocket className="w-4 h-4 mr-2" />
                        Use Template
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => handleCopyPrompt(template.prompt)}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
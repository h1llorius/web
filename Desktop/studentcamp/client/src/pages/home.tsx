import { Link } from "wouter"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Youtube,
  Scissors,
  Palette,
  Rocket,
  Play,
  Download,
  Wand2,
  SwatchBook,
  Sparkles,
  ArrowRight,
} from "lucide-react"

export default function Home() {
  const features = [
    {
      id: "video-converter",
      title: "Video Converter",
      subtitle: "MP4 & MP3 Conversion",
      description:
        "Convert your video files to high-quality MP4 or MP3 format. Support for multiple input formats and quality settings.",
      icon: Youtube,
      bgColor: "bg-gradient-to-br from-blue-50 to-blue-100",
      iconColor: "text-blue-600",
      actionIcon: Download,
      route: "/youtube-converter",
    },
    {
      id: "bg-remover",
      title: "Background Remover",
      subtitle: "AI-Powered Editing",
      description:
        "Remove backgrounds from images with precision using advanced AI technology. Perfect for product photos and portraits.",
      icon: Scissors,
      bgColor: "bg-gradient-to-br from-cyan-50 to-cyan-100",
      iconColor: "text-cyan-600",
      actionIcon: Wand2,
      route: "/bg-remover",
    },

    {
      id: "color-generator",
      title: "Color Palette Generator",
      subtitle: "Design Inspiration",
      description:
        "Generate beautiful color palettes for your designs. Export in multiple formats and find perfect color combinations.",
      icon: Palette,
      bgColor: "bg-gradient-to-br from-purple-50 to-purple-100",
      iconColor: "text-purple-600",
      actionIcon: SwatchBook,
      route: "/color-generator",
    },
  ]



  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50/30 to-white">
      {/* Floating Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-100/40 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-cyan-100/40 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-40 left-1/4 w-40 h-40 bg-indigo-100/30 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Hero Section */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 bg-white/80 backdrop-blur-sm border border-blue-200/50 rounded-full text-sm text-blue-700 font-medium mb-8 shadow-lg">
            <Sparkles className="w-4 h-4 mr-2" />
            New: Enhanced AI Tools Available
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-slate-900 mb-8 leading-tight">
            Your Complete
            <span className="block bg-gradient-to-r from-blue-600 via-cyan-500 to-indigo-600 bg-clip-text text-transparent">
              Digital Toolkit
            </span>
          </h1>
          
          <p className="text-xl text-slate-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            Transform your digital workflow with our suite of powerful, easy-to-use tools. 
            Convert, create, and enhance your content with just a few clicks.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button 
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white px-10 py-6 h-auto font-semibold transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl rounded-2xl"
            >
              <Rocket className="mr-3 h-6 w-6" />
              Get Started Free
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            Powerful Tools at Your
            <span className="block bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Fingertips
            </span>
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Choose from our collection of professional-grade tools designed to streamline your digital tasks.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            const ActionIcon = feature.actionIcon;
            
            return (
              <Card 
                key={feature.id} 
                className="group hover:shadow-2xl transition-all duration-500 border-0 bg-white/80 backdrop-blur-sm hover:bg-white hover:scale-[1.02] rounded-3xl overflow-hidden"
                style={{
                  animationDelay: `${index * 100}ms`
                }}
              >
                <CardContent className="p-10">
                  <div className="flex items-center mb-8">
                    <div className={`w-16 h-16 ${feature.bgColor} rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 shadow-lg`}>
                      <IconComponent className={`${feature.iconColor}`} size={32} />
                    </div>
                    <div className="ml-6">
                      <h3 className="text-2xl font-bold text-slate-900 mb-1">{feature.title}</h3>
                      <p className="text-blue-600 font-medium">{feature.subtitle}</p>
                    </div>
                  </div>
                  
                  <p className="text-slate-600 mb-8 leading-relaxed text-lg">
                    {feature.description}
                  </p>
                  
                  <Link href={feature.route}>
                    <Button
                      className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white py-4 font-semibold transition-all duration-300 rounded-xl shadow-lg hover:shadow-xl group/btn"
                      size="lg"
                    >
                      <ActionIcon className="mr-3 h-5 w-5 transition-transform group-hover/btn:scale-110" />
                      Open Tool
                      <ArrowRight className="ml-3 h-5 w-5 transition-transform group-hover/btn:translate-x-1" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>



      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-blue-50/50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            Ready to Transform Your
            <span className="block bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
              Digital Workflow?
            </span>
          </h2>
          <p className="text-xl text-slate-600 mb-10 leading-relaxed">
            Start using our powerful tools today and experience the difference.
          </p>
          <Button 
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white px-12 py-6 h-auto font-semibold transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl rounded-2xl"
          >
            <Sparkles className="mr-3 h-6 w-6" />
            Get Started Now
          </Button>
        </div>
      </section>
    </div>
  )
}

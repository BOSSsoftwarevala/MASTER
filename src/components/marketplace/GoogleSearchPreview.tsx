import { Search, Globe, Star } from 'lucide-react';

export function GoogleSearchPreview() {
  return (
    <section className="py-16 relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
            Find Us on Google
          </h2>
          <p className="text-muted-foreground">
            See how Software Vala appears in Google Search results
          </p>
        </div>

        {/* Google Search Preview Card */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl p-6 shadow-xl">
            {/* Google Search Bar */}
            <div className="flex items-center gap-3 mb-6 p-3 rounded-full border border-gray-200 bg-gray-50">
              <Search className="w-5 h-5 text-gray-400" />
              <span className="text-gray-800 font-medium">software vala</span>
              <div className="ml-auto flex gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <Search className="w-4 h-4 text-blue-500" />
                </div>
              </div>
            </div>

            {/* Search Result */}
            <div className="space-y-4">
              {/* Main Result */}
              <div className="group cursor-pointer">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center">
                    <span className="text-white text-xs font-bold">SV</span>
                  </div>
                  <div>
                    <div className="text-xs text-gray-600">softwarevala.com</div>
                    <div className="flex items-center gap-1">
                      <Globe className="w-3 h-3 text-gray-400" />
                      <span className="text-xs text-gray-500">https://softwarevala.com</span>
                    </div>
                  </div>
                </div>
                <h3 className="text-xl text-blue-700 group-hover:underline mb-1 font-medium">
                  Software Vala - The Name of Trust | Premium Software Marketplace
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Discover 4000+ genuine software solutions. Fixed pricing, secure licenses, AI customization. 
                  Trusted by 52+ franchises across 10+ countries. Demo before you buy.
                </p>
                
                {/* Rich Snippets */}
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-1">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <span className="text-xs text-gray-600">4.9 • 2.5K reviews</span>
                  </div>
                </div>

                {/* Sitelinks */}
                <div className="grid grid-cols-2 gap-x-8 gap-y-2 mt-4 pl-1">
                  <a href="#" className="text-blue-600 text-sm hover:underline">Browse Software</a>
                  <a href="#" className="text-blue-600 text-sm hover:underline">Pricing Plans</a>
                  <a href="#" className="text-blue-600 text-sm hover:underline">Franchise</a>
                  <a href="#" className="text-blue-600 text-sm hover:underline">Contact Us</a>
                </div>
              </div>

              {/* Separator */}
              <div className="border-t border-gray-100 pt-4">
                <div className="text-xs text-gray-500">
                  About 12,500 results (0.42 seconds)
                </div>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center mt-6">
            <a 
              href="https://www.google.com/search?q=software+vala" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-primary to-accent text-primary-foreground font-medium hover:opacity-90 transition-opacity"
            >
              <Search className="w-4 h-4" />
              Search on Google
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
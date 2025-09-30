import { Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <main className="flex mt-24 flex-col items-center justify-center px-6 py-20 text-center">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Main Heading */}
        <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold leading-tigh">
          Publish on the <span className="text-main">Datachain</span>
        </h1>

        {/* Subtitle */}
        <p className="font-display-inter text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
          Create, share, and own your content forever with cryptographic proof
          of authorship on Irys's programmable datachain.
        </p>

        {/* Call to Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
          <Link to={"/write"}>
            <Button className="bg-main cursor-pointer hover:bg-main text-black font-medium px-8 py-5 text-lg">
              <Rocket className="w-5 h-5 mr-2" />
              Start Writing
            </Button>
          </Link>
          <Button
            variant="outline"
            className="cursor-pointer border-white text-white hover:bg-white hover:text-black px-8 py-5 text-lg bg-transparent"
          >
            Learn More
          </Button>
        </div>
      </div>
    </main>
  );
};

export default Hero;

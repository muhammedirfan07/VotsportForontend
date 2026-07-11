import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Footer from '../common/Footer';

const ProjectManagementApp = () => {
  const navigate = useNavigate()

  return (
    <>
      <div className="relative min-h-screen bg-background text-foreground flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 grid-lines pointer-events-none" />

        <div className="absolute top-5 left-5 z-10">
          <Link to="/">
            <h3 className="flex items-center text-xl gap-2 text-foreground font-bold">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
                <i className="fa-solid fa-bolt text-lg text-primary-foreground"></i>
              </span>
              <span className="text-2xl font-heading"><span className="text-primary">Volt</span>Spot</span>
            </h3>
          </Link>
        </div>

        <section className="relative py-16">
          <div className="container mx-auto md:px-6 px-6 py-10 text-center">
            <div className="flex items-center justify-center gap-3 text-mono text-primary mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              Welcome / Let's build together
            </div>

            <h1 className="text-4xl md:text-6xl font-semibold tracking-tight leading-[1.05] mb-4">
              Ready to collaborate
            </h1>
            <h2 className="text-4xl md:text-6xl font-semibold tracking-tight leading-[1.05] mb-8">
              <span className="text-primary">on the future</span>
              <span className="text-foreground"> of EV charging?</span>
            </h2>

            <p className="text-muted-foreground max-w-2xl mx-auto mb-10 text-lg">
              VoltSpot is the platform for modern EV charging collaboration — bringing
              drivers and partners together to build a seamless, efficient, and
              sustainable charging network. Join us in driving the future of electric mobility.
            </p>

            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-16">
              <button
                 onClick={()=>navigate('/Networks')}
                className="group relative inline-flex items-center gap-1.5 cursor-pointer overflow-hidden rounded-full border border-border px-8 py-3 text-sm text-foreground transition-colors hover:border-primary hover:text-primary"
              >
                <span className="absolute inset-0 bg-primary transition-transform duration-300 ease-out group-hover:translate-x-full" />
                <span className="relative z-10 flex items-center gap-1.5 transition-colors duration-300 group-hover:text-primary">
                  Let's go
                  <ArrowRight
                    size={16}
                    strokeWidth={1.75}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </span>
              </button>

            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default ProjectManagementApp;
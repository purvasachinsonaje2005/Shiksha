"use client";
import { motion } from "framer-motion";
import {
  IconSparkles,
  IconTrendingUp,
  IconUsers,
  IconHeart,
  IconSchool,
  IconHeartHandshake,
  IconTargetArrow,
  IconBrain,
  IconBell,
  IconChartBar,
  IconCurrencyDollar,
  IconMessageCircle,
  IconTarget,
  IconMoodHeart,
  IconUserShield,
  IconChalkboard,
  IconUser,
  IconSend,
} from "@tabler/icons-react";
import { useState } from "react";

export default function HomePage() {
  const beneficiaries = [
    {
      icon: IconSchool,
      title: "Schools & Institutions",
      description:
        "Comprehensive oversight and data-driven insights to reduce dropout rates.",
    },
    {
      icon: IconUsers,
      title: "Teachers & Administrators",
      description:
        "Real-time alerts and tools to identify and support at-risk students.",
    },
    {
      icon: IconHeartHandshake,
      title: "Parents & Guardians",
      description:
        "Stay informed and connected with your child's academic journey.",
    },
    {
      icon: IconTargetArrow,
      title: "Students",
      description:
        "Access resources, track progress, and receive personalized support.",
    },
  ];
  const features = [
    {
      icon: IconBrain,
      title: "AI-Driven Dropout Prediction",
      description:
        "Advanced machine learning algorithms identify students at risk before it's too late.",
    },
    {
      icon: IconBell,
      title: "Real-Time Teacher Alerts",
      description:
        "Instant notifications when students show warning signs or need intervention.",
    },
    {
      icon: IconChartBar,
      title: "Performance Dashboards",
      description:
        "Comprehensive analytics and visualizations to track student progress and trends.",
    },
    {
      icon: IconUsers,
      title: "Community Learning Hub",
      description:
        "Collaborative space for students to connect, learn, and support each other.",
    },
    {
      icon: IconCurrencyDollar,
      title: "Financial Aid & Scholarships",
      description:
        "Streamlined management of financial assistance programs and opportunities.",
    },
    {
      icon: IconMessageCircle,
      title: "Parent-Teacher Portal",
      description:
        "Seamless communication channel for updates, concerns, and collaboration.",
    },
    {
      icon: IconTarget,
      title: "Student Engagement Tracking",
      description:
        "Monitor participation, set goals, and celebrate achievements together.",
    },
    {
      icon: IconMoodHeart,
      title: "Counseling & Well-being",
      description:
        "Integrated mental health support and counseling services for holistic care.",
    },
  ];
  const steps = [
    {
      icon: IconUserShield,
      title: "Admin Panel",
      description:
        "Register school, manage scholarships, and oversee the entire system.",
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      icon: IconSchool,
      title: "Head Master Panel",
      description:
        "Add teachers, enroll students, and manage institutional operations.",
      color: "text-secondary",
      bgColor: "bg-secondary/10",
    },
    {
      icon: IconChalkboard,
      title: "Teacher Panel",
      description:
        "Monitor student risk levels, track progress, and provide timely interventions.",
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
    {
      icon: IconUser,
      title: "Student/Parent Panel",
      description:
        "Access learning resources, receive updates, and stay connected.",
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
  ];
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <>
      <section
        id="hero"
        className="min-h-screen flex items-center justify-center pt-16 bg-linear-to-br from-primary/10 via-secondary/10 to-accent/10"
      >
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-linear-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                Shiksha
              </h1>
              <h2 className="text-3xl md:text-4xl font-semibold mb-6 text-base-content">
                AI-Powered Student Dropout Prevention System
              </h2>
              <p className="text-xl text-base-content/80 mb-10 max-w-2xl mx-auto">
                Empowering schools, teachers, and parents to identify at-risk
                students early and provide the support they need to succeed.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="flex flex-wrap gap-4 justify-center mb-16"
            >
              <button className="btn btn-primary btn-lg">Get Started</button>
              <button className="btn btn-outline btn-lg">Learn More</button>
            </motion.div>

            {/* Feature Cards */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="grid grid-cols-1 md:grid-cols-4 gap-6"
            >
              {[
                {
                  icon: IconSparkles,
                  label: "AI-Powered",
                  color: "text-primary",
                },
                {
                  icon: IconTrendingUp,
                  label: "Real-Time Alerts",
                  color: "text-secondary",
                },
                {
                  icon: IconUsers,
                  label: "Collaborative",
                  color: "text-accent",
                },
                {
                  icon: IconHeart,
                  label: "Student-Centric",
                  color: "text-primary",
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="card bg-base-300 backdrop-blur-sm border border-base-content shadow-lg"
                >
                  <div className="card-body items-center text-center p-6">
                    <item.icon size={40} className={item.color} />
                    <p className="font-semibold text-base-content mt-2">
                      {item.label}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>
      <section id="about" className="py-20 bg-base-200">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-base-content">
              About Shiksha
            </h2>
            <p className="text-xl text-base-content/80 max-w-3xl mx-auto">
              Shiksha is an innovative platform that leverages AI and data
              analytics to predict and prevent student dropouts. We bridge the
              gap between schools, teachers, parents, and students through
              intelligent monitoring and comprehensive support systems.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {beneficiaries.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                whileHover={{ scale: 1.05, y: -10 }}
                className="card bg-base-300 border border-base-content shadow-xl"
              >
                <div className="card-body items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <item.icon size={32} className="text-primary" />
                  </div>
                  <h3 className="card-title text-lg mb-2 text-base-content">
                    {item.title}
                  </h3>
                  <p className="text-base-content/80 text-sm">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <section id="features" className="py-20 bg-base-300">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-base-content">
              Powerful Features
            </h2>
            <p className="text-xl text-base-content/80 max-w-3xl mx-auto">
              Everything you need to support student success and prevent
              dropouts in one comprehensive platform.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05, duration: 0.6 }}
                whileHover={{ scale: 1.05, y: -10 }}
                className="card bg-base-300 border border-base-content shadow-xl hover:shadow-2xl transition-all"
              >
                <div className="card-body">
                  <div className="w-14 h-14 rounded-xl bg-linear-to-br from-primary to-secondary flex items-center justify-center mb-4">
                    <feature.icon size={28} className="text-primary-content" />
                  </div>
                  <h3 className="card-title text-lg mb-2 text-card-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-base-content/80 text-sm">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <section id="how-it-works" className="py-20 bg-base-200">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-base-content">
              How It Works
            </h2>
            <p className="text-xl text-base-content/80 max-w-3xl mx-auto">
              A four-tier panel system designed to streamline operations and
              support all stakeholders.
            </p>
          </motion.div>

          {/* Desktop Timeline */}
          <div className="hidden lg:block">
            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute top-1/2 left-0 right-0 h-1 bg-border -translate-y-1/2" />

              <div className="grid grid-cols-4 gap-8 relative">
                {steps.map((step, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.2, duration: 0.6 }}
                    className="flex flex-col items-center"
                  >
                    {/* Icon Circle */}
                    <div
                      className={`w-20 h-20 rounded-full ${step.bgColor} flex items-center justify-center mb-6 border-4 border-background relative z-10`}
                    >
                      <step.icon size={36} className={step.color} />
                    </div>

                    {/* Card */}
                    <div className="card bg-base-300 border border-base-content shadow-xl w-full">
                      <div className="card-body text-center p-6">
                        <div className="badge badge-primary mb-2">
                          Step {index + 1}
                        </div>
                        <h3 className="font-bold text-lg mb-2 text-card-foreground">
                          {step.title}
                        </h3>
                        <p className="text-base-content/80 text-sm">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Mobile/Tablet Steps */}
          <div className="lg:hidden space-y-6">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="card bg-base-300 border border-base-content shadow-xl"
              >
                <div className="card-body">
                  <div className="flex items-center gap-4 mb-4">
                    <div
                      className={`w-16 h-16 rounded-full ${step.bgColor} flex items-center justify-center shrink-0`}
                    >
                      <step.icon size={32} className={step.color} />
                    </div>
                    <div>
                      <div className="badge badge-primary mb-1">
                        Step {index + 1}
                      </div>
                      <h3 className="font-bold text-lg text-card-foreground">
                        {step.title}
                      </h3>
                    </div>
                  </div>
                  <p className="text-base-content/80">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <section id="contact" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-base-content">
              Get In Touch
            </h2>
            <p className="text-xl text-base-content/80 max-w-3xl mx-auto">
              Have questions? We'd love to hear from you. Send us a message and
              we'll respond as soon as possible.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="max-w-2xl mx-auto"
          >
            <div className="card bg-base-300 border border-base-content shadow-2xl">
              <div className="card-body p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <fieldset className="fieldset">
                    <legend className="fieldset-legend">
                      Name <span className="text-error">*</span>
                    </legend>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your name"
                      className="input input-primary w-full"
                      required
                    />
                  </fieldset>

                  <fieldset className="fieldset">
                    <legend className="fieldset-legend">
                      Email <span className="text-error">*</span>
                    </legend>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="your.email@example.com"
                      className="input input-primary w-full"
                      required
                    />
                  </fieldset>

                  <fieldset className="fieldset">
                    <legend className="fieldset-legend">
                      Email <span className="text-error">*</span>
                    </legend>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell us how we can help..."
                      className="textarea textarea-primary w-full"
                      required
                    />
                  </fieldset>

                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="btn btn-primary w-full gap-2"
                  >
                    <IconSend size={20} />
                    Send Message
                  </motion.button>
                </form>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}

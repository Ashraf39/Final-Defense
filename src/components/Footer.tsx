export const Footer = () => {
  return (
    <footer className="relative overflow-hidden bg-muted">
      {/* Decorative circles */}
      <div className="absolute -left-4 -bottom-4 w-24 h-24 rounded-full bg-primary/5" />
      <div className="absolute -right-4 -top-4 w-16 h-16 rounded-full bg-secondary/10" />
      
      <div className="container mx-auto px-4 py-8 relative">
        <div className="flex flex-col items-center justify-center space-y-4">
          {/* Logo text */}
          <h3 className="text-xl font-serif font-bold text-primary">
            PharmaCare
          </h3>
          
          {/* Separator line */}
          <div className="w-24 h-0.5 bg-primary/30" />
          
          {/* Copyright text */}
          <p className="text-sm text-gray-600">
            &copy; 2024 PharmaCare. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
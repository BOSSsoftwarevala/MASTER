import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Compass, Home, ArrowLeft, Headphones } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Internal logging only - user never sees this
    console.group('🔒 Navigation Log (Internal)');
    console.log("Route requested:", location.pathname);
    console.log("Timestamp:", new Date().toISOString());
    console.groupEnd();
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/30 p-6">
      <Card className="max-w-md w-full rounded-2xl border-2 border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/30 shadow-lg">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-background shadow-md">
            <Compass className="h-10 w-10 text-blue-500 animate-pulse" />
          </div>
          <CardTitle className="text-2xl font-semibold">
            Finding Your Way
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-muted-foreground text-base leading-relaxed">
            The page you're looking for might have been moved or is being updated. 
            Let us help you get back on track.
          </p>
          <div className="mt-4 p-3 rounded-lg bg-background/50 text-sm text-muted-foreground">
            <p>No worries – we've got you covered!</p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-3 pt-2">
          <Button 
            onClick={() => navigate('/dashboard')}
            className="w-full rounded-full gap-2"
            size="lg"
          >
            <Home className="h-4 w-4" />
            Go to Dashboard
          </Button>
          <div className="flex gap-3 w-full">
            <Button 
              variant="outline"
              onClick={() => navigate(-1)}
              className="flex-1 rounded-full gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Go Back
            </Button>
            <Button 
              variant="outline"
              onClick={() => navigate('/dashboard/support/tickets')}
              className="flex-1 rounded-full gap-2"
            >
              <Headphones className="h-4 w-4" />
              Support
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default NotFound;

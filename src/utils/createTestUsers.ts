import { supabase } from "@/integrations/supabase/client";

// Test user data - you can use these credentials to log in
export const testUsers = [
  {
    email: "admin@acmecorp.com",
    password: "test123456",
    company_name: "Acme Corporation",
    role: "admin" as const
  },
  {
    email: "manager@techstart.com", 
    password: "test123456",
    company_name: "TechStart Solutions LLC",
    role: "manager" as const
  },
  {
    email: "user@smallbiz.com",
    password: "test123456", 
    company_name: "Small Business Consulting",
    role: "user" as const
  },
  {
    email: "admin@global.com",
    password: "test123456",
    company_name: "Global Enterprises Inc", 
    role: "admin" as const
  },
  {
    email: "manager@creative.com",
    password: "test123456",
    company_name: "Creative Marketing Agency",
    role: "manager" as const
  }
];

export const createTestUser = async (userData: typeof testUsers[0]) => {
  try {
    const redirectUrl = `${window.location.origin}/`;
    
    // Create the user account
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          company_name: userData.company_name
        }
      }
    });

    if (authError) {
      console.error(`Error creating user ${userData.email}:`, authError.message);
      return { success: false, error: authError.message };
    }

    if (authData.user) {
      // Update the user's profile with the role (since the trigger creates it as 'user' by default)
      if (userData.role !== 'user') {
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ 
            role: userData.role,
            company_name: userData.company_name 
          })
          .eq('user_id', authData.user.id);

        if (updateError) {
          console.error(`Error updating role for ${userData.email}:`, updateError.message);
          return { success: false, error: updateError.message };
        }
      }

      console.log(`✅ Created test user: ${userData.email} (${userData.role})`);
      return { success: true, user: authData.user };
    }

    return { success: false, error: 'No user returned from signup' };
  } catch (error) {
    console.error(`Unexpected error creating ${userData.email}:`, error);
    return { success: false, error: String(error) };
  }
};

export const createAllTestUsers = async () => {
  console.log("Creating test users...");
  const results = [];
  
  for (const userData of testUsers) {
    const result = await createTestUser(userData);
    results.push({ email: userData.email, ...result });
    
    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log("Test user creation complete!");
  console.log("Results:", results);
  
  return results;
};
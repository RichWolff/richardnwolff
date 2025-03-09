type Skill = {
  id: string;
  name: string;
  category: string;
  proficiency: number;
};

type SkillsSectionProps = {
  title: string;
  skills: Skill[];
};

export default function SkillsSection({ title, skills }: SkillsSectionProps) {
  // Group skills by category
  const skillsByCategory = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);
  
  // Sort categories alphabetically
  const categories = Object.keys(skillsByCategory).sort();
  
  return (
    <section>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">{title}</h2>
      
      <div className="space-y-8">
        {categories.map((category) => (
          <div key={category}>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">{category}</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {skillsByCategory[category]
                .sort((a, b) => b.proficiency - a.proficiency) // Sort by proficiency (highest first)
                .map((skill) => (
                  <div key={skill.id} className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-gray-900 dark:text-white">{skill.name}</span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">{skill.proficiency}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                      <div 
                        className="bg-blue-600 h-2.5 rounded-full" 
                        style={{ width: `${skill.proficiency}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
} 
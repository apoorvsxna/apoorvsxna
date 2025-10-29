import { useState } from 'react';
import { Plus, Trash2, ChevronDown, ChevronRight, Save, Download, Upload, Eye } from 'lucide-react';

export const Editor = ({ initialData, onSave, onPreview }) => {
  const [data, setData] = useState(initialData);
  const [expandedSections, setExpandedSections] = useState({});
  const [expandedFolders, setExpandedFolders] = useState({});

  const updateProfile = (field, value) => {
    setData(prev => ({
      ...prev,
      profile: { ...prev.profile, [field]: value }
    }));
  };

  const addSection = () => {
    const newSection = {
      id: `section-${Date.now()}`,
      name: 'New Section',
      icon: 'circle',
      items: []
    };
    setData(prev => ({
      ...prev,
      sections: [...prev.sections, newSection]
    }));
  };

  const updateSection = (sectionIndex, field, value) => {
    setData(prev => {
      const newSections = [...prev.sections];
      newSections[sectionIndex] = {
        ...newSections[sectionIndex],
        [field]: value
      };
      return { ...prev, sections: newSections };
    });
  };

  const deleteSection = (sectionIndex) => {
    if (confirm('Delete this section and all its contents?')) {
      setData(prev => ({
        ...prev,
        sections: prev.sections.filter((_, i) => i !== sectionIndex)
      }));
    }
  };

  const addItem = (sectionIndex, parentPath = null) => {
    const newItem = {
      type: 'item',
      id: `item-${Date.now()}`,
      name: 'New Item',
      description: '',
      icon: 'circle',
      content: '# New Content\n\nAdd your markdown content here.'
    };

    setData(prev => {
      const newSections = [...prev.sections];
      const section = newSections[sectionIndex];

      if (parentPath === null) {
        section.items = [...section.items, newItem];
      } else {
        const folder = section.items.find(item => item.id === parentPath);
        if (folder && folder.type === 'folder') {
          folder.items = [...(folder.items || []), newItem];
        }
      }

      return { ...prev, sections: newSections };
    });
  };

  const addFolder = (sectionIndex) => {
    const newFolder = {
      type: 'folder',
      id: `folder-${Date.now()}`,
      name: 'New Folder',
      icon: 'folder',
      items: []
    };

    setData(prev => {
      const newSections = [...prev.sections];
      newSections[sectionIndex].items = [
        ...newSections[sectionIndex].items,
        newFolder
      ];
      return { ...prev, sections: newSections };
    });
  };

  const updateItem = (sectionIndex, itemId, field, value) => {
    setData(prev => {
      const newSections = [...prev.sections];
      const section = newSections[sectionIndex];

      const updateInArray = (items) => {
        return items.map(item => {
          if (item.id === itemId) {
            return { ...item, [field]: value };
          }
          if (item.type === 'folder' && item.items) {
            return { ...item, items: updateInArray(item.items) };
          }
          return item;
        });
      };

      section.items = updateInArray(section.items);
      return { ...prev, sections: newSections };
    });
  };

  const deleteItem = (sectionIndex, itemId) => {
    if (confirm('Delete this item?')) {
      setData(prev => {
        const newSections = [...prev.sections];
        const section = newSections[sectionIndex];

        const deleteFromArray = (items) => {
          return items.filter(item => {
            if (item.id === itemId) return false;
            if (item.type === 'folder' && item.items) {
              item.items = deleteFromArray(item.items);
            }
            return true;
          });
        };

        section.items = deleteFromArray(section.items);
        return { ...prev, sections: newSections };
      });
    }
  };

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const toggleFolder = (folderId) => {
    setExpandedFolders(prev => ({
      ...prev,
      [folderId]: !prev[folderId]
    }));
  };

  const exportData = () => {
    const dataStr = JSON.stringify(data, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'portfolio-data.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  const importData = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const imported = JSON.parse(e.target.result);
          setData(imported);
          alert('Data imported successfully!');
        } catch (error) {
          alert('Error importing data: ' + error.message);
        }
      };
      reader.readAsText(file);
    }
  };

  const renderItem = (item, sectionIndex, parentFolderId = null, depth = 0) => {
    const isFolder = item.type === 'folder';
    const isExpanded = expandedFolders[item.id];

    return (
      <div key={item.id} className="bg-white/5 border border-white/10 rounded-lg p-3" style={{ marginLeft: `${depth * 16}px` }}>
        <div className="flex items-start gap-3">
          {isFolder && (
            <button
              onClick={() => toggleFolder(item.id)}
              className="text-white/40 hover:text-white/70 mt-1 transition-colors"
            >
              {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>
          )}
          
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={item.name}
                onChange={(e) => updateItem(sectionIndex, item.id, 'name', e.target.value)}
                className="flex-1 bg-white/5 border border-white/10 text-white px-2.5 py-1.5 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-transparent placeholder:text-white/30"
                placeholder="Item name"
              />
              <input
                type="text"
                value={item.icon}
                onChange={(e) => updateItem(sectionIndex, item.id, 'icon', e.target.value)}
                className="w-24 bg-white/5 border border-white/10 text-white px-2.5 py-1.5 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-transparent placeholder:text-white/30"
                placeholder="Icon"
              />
              <span className="text-xs text-white/50 font-medium px-2">{isFolder ? 'Folder' : 'Item'}</span>
              <button
                onClick={() => deleteItem(sectionIndex, item.id)}
                className="text-white/40 hover:text-red-400 transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>

            {!isFolder && (
              <input
                type="text"
                value={item.description || ''}
                onChange={(e) => updateItem(sectionIndex, item.id, 'description', e.target.value)}
                className="w-full bg-white/5 border border-white/10 text-white px-2.5 py-1.5 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-transparent placeholder:text-white/30"
                placeholder="Description (optional)"
              />
            )}

            {!isFolder && (
              <textarea
                value={item.content || ''}
                onChange={(e) => updateItem(sectionIndex, item.id, 'content', e.target.value)}
                className="w-full bg-white/5 border border-white/10 text-white px-2.5 py-1.5 rounded-md text-sm font-mono focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-transparent resize-y placeholder:text-white/30"
                rows={4}
                placeholder="Markdown content"
              />
            )}
          </div>
        </div>

        {isFolder && isExpanded && (
          <div className="mt-3 space-y-2 pl-5">
            {item.items && item.items.map(subItem => 
              renderItem(subItem, sectionIndex, item.id, depth + 1)
            )}
            <button
              onClick={() => addItem(sectionIndex, item.id)}
              className="text-sm text-white/50 hover:text-white/80 flex items-center gap-1.5 px-2 py-1 rounded transition-colors"
            >
              <Plus size={14} /> Add item to folder
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-black">
      {/* macOS-style window chrome */}
      <div className="bg-neutral-900 border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
              </div>
              <h1 className="text-base font-medium text-white">Portfolio Editor</h1>
            </div>
            
            <div className="flex gap-2">
              <label className="cursor-pointer bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-md flex items-center gap-2 text-sm transition-colors text-white">
                <Upload size={14} />
                Import
                <input type="file" accept=".json" onChange={importData} className="hidden" />
              </label>
              <button
                onClick={exportData}
                className="bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-md flex items-center gap-2 text-sm transition-colors text-white"
              >
                <Download size={14} />
                Export
              </button>
              <button
                onClick={() => onPreview(data)}
                className="bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-md flex items-center gap-2 text-sm transition-colors text-white"
              >
                <Eye size={14} />
                Preview
              </button>
              <button
                onClick={() => onSave(data)}
                className="bg-white hover:bg-white/90 text-black px-3 py-1.5 rounded-md flex items-center gap-2 text-sm font-medium transition-colors"
              >
                <Save size={14} />
                Save
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Profile Section */}
        <div className="bg-white/5 rounded-xl border border-white/10 p-6 mb-6">
          <h2 className="text-base font-semibold text-white mb-4">Profile</h2>
          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium text-white/60 mb-1.5 block">Name</label>
              <input
                type="text"
                value={data.profile.name}
                onChange={(e) => updateProfile('name', e.target.value)}
                className="w-full bg-white/5 border border-white/10 text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-transparent transition-shadow placeholder:text-white/30"
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-white/60 mb-1.5 block">Profile Picture URL</label>
              <input
                type="text"
                value={data.profile.picture}
                onChange={(e) => updateProfile('picture', e.target.value)}
                className="w-full bg-white/5 border border-white/10 text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-transparent transition-shadow placeholder:text-white/30"
                placeholder="/profile.jpg"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-white/60 mb-1.5 block">CV Link</label>
              <input
                type="text"
                value={data.profile.cvLink}
                onChange={(e) => updateProfile('cvLink', e.target.value)}
                className="w-full bg-white/5 border border-white/10 text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-transparent transition-shadow placeholder:text-white/30"
                placeholder="https://..."
              />
            </div>
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-white">Sections</h2>
            <button
              onClick={addSection}
              className="bg-white hover:bg-white/90 text-black px-3 py-1.5 rounded-lg flex items-center gap-1.5 text-sm font-medium transition-colors"
            >
              <Plus size={14} />
              Add Section
            </button>
          </div>

          {data.sections.map((section, sectionIndex) => (
            <div key={section.id} className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
              <div className="p-4 border-b border-white/10">
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => toggleSection(section.id)}
                    className="text-white/40 hover:text-white/70 mt-2 transition-colors"
                  >
                    {expandedSections[section.id] ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                  </button>

                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={section.name}
                        onChange={(e) => updateSection(sectionIndex, 'name', e.target.value)}
                        className="flex-1 bg-white/5 border border-white/10 text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-transparent transition-shadow placeholder:text-white/30"
                        placeholder="Section name"
                      />
                      <input
                        type="text"
                        value={section.icon}
                        onChange={(e) => updateSection(sectionIndex, 'icon', e.target.value)}
                        className="w-32 bg-white/5 border border-white/10 text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-transparent transition-shadow placeholder:text-white/30"
                        placeholder="Icon"
                      />
                      <button
                        onClick={() => deleteSection(sectionIndex)}
                        className="text-white/40 hover:text-red-400 p-2 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {expandedSections[section.id] && (
                <div className="p-4">
                  <div className="space-y-3">
                    {section.items.map(item => renderItem(item, sectionIndex))}
                    
                    <div className="flex gap-2 pt-2">
                      <button
                        onClick={() => addItem(sectionIndex)}
                        className="text-sm text-white/50 hover:text-white/80 flex items-center gap-1.5 px-2 py-1 rounded transition-colors"
                      >
                        <Plus size={14} /> Add Item
                      </button>
                      <button
                        onClick={() => addFolder(sectionIndex)}
                        className="text-sm text-white/50 hover:text-white/80 flex items-center gap-1.5 px-2 py-1 rounded transition-colors"
                      >
                        <Plus size={14} /> Add Folder
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="text-center text-white/40 text-xs mt-8 pb-8">
          <p>Use Lucide icon names: music, code, briefcase, plane, folder, circle, etc.</p>
          <p className="mt-1">Visit <a href="https://lucide.dev/icons" target="_blank" rel="noopener noreferrer" className="underline hover:text-white/60">lucide.dev/icons</a> for all icon names</p>
        </div>
      </div>
    </div>
  );
};

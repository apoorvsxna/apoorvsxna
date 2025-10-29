import { useState } from 'react';
import { Plus, Trash2, ChevronDown, ChevronRight, Save, Download, Upload, Eye, X } from 'lucide-react';

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
        // Add to section root
        section.items = [...section.items, newItem];
      } else {
        // Add to folder
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

  const updateItem = (sectionIndex, itemId, field, value, parentFolderId = null) => {
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
      <div key={item.id} className="border border-white/10 rounded p-3" style={{ marginLeft: `${depth * 20}px` }}>
        <div className="flex items-start gap-3">
          {isFolder && (
            <button
              onClick={() => toggleFolder(item.id)}
              className="text-white/50 hover:text-white mt-1"
            >
              {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>
          )}
          
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={item.name}
                onChange={(e) => updateItem(sectionIndex, item.id, 'name', e.target.value, parentFolderId)}
                className="flex-1 bg-white/5 text-white px-2 py-1 rounded text-sm"
                placeholder="Item name"
              />
              <input
                type="text"
                value={item.icon}
                onChange={(e) => updateItem(sectionIndex, item.id, 'icon', e.target.value, parentFolderId)}
                className="w-24 bg-white/5 text-white px-2 py-1 rounded text-sm"
                placeholder="Icon"
              />
              <span className="text-xs text-white/50">{isFolder ? 'Folder' : 'Item'}</span>
              <button
                onClick={() => deleteItem(sectionIndex, item.id)}
                className="text-red-400 hover:text-red-300"
              >
                <Trash2 size={16} />
              </button>
            </div>

            {!isFolder && (
              <input
                type="text"
                value={item.description || ''}
                onChange={(e) => updateItem(sectionIndex, item.id, 'description', e.target.value, parentFolderId)}
                className="w-full bg-white/5 text-white px-2 py-1 rounded text-sm"
                placeholder="Description (optional)"
              />
            )}

            {!isFolder && (
              <textarea
                value={item.content || ''}
                onChange={(e) => updateItem(sectionIndex, item.id, 'content', e.target.value, parentFolderId)}
                className="w-full bg-white/5 text-white px-2 py-1 rounded text-sm font-mono"
                rows={4}
                placeholder="Markdown content"
              />
            )}
          </div>
        </div>

        {isFolder && isExpanded && (
          <div className="mt-3 space-y-2">
            {item.items && item.items.map(subItem => 
              renderItem(subItem, sectionIndex, item.id, depth + 1)
            )}
            <button
              onClick={() => addItem(sectionIndex, item.id)}
              className="text-sm text-white/50 hover:text-white flex items-center gap-1"
              style={{ marginLeft: `${(depth + 1) * 20}px` }}
            >
              <Plus size={14} /> Add item to folder
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Portfolio Editor</h1>
          <div className="flex gap-2">
            <label className="cursor-pointer bg-white/10 hover:bg-white/20 px-4 py-2 rounded flex items-center gap-2">
              <Upload size={16} />
              Import JSON
              <input type="file" accept=".json" onChange={importData} className="hidden" />
            </label>
            <button
              onClick={exportData}
              className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded flex items-center gap-2"
            >
              <Download size={16} />
              Export JSON
            </button>
            <button
              onClick={() => onPreview(data)}
              className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded flex items-center gap-2"
            >
              <Eye size={16} />
              Preview
            </button>
            <button
              onClick={() => onSave(data)}
              className="bg-white text-black px-4 py-2 rounded flex items-center gap-2 font-medium"
            >
              <Save size={16} />
              Save
            </button>
          </div>
        </div>

        {/* Profile Section */}
        <div className="bg-white/5 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Profile</h2>
          <div className="space-y-3">
            <input
              type="text"
              value={data.profile.name}
              onChange={(e) => updateProfile('name', e.target.value)}
              className="w-full bg-white/5 text-white px-3 py-2 rounded"
              placeholder="Name"
            />
            <input
              type="text"
              value={data.profile.picture}
              onChange={(e) => updateProfile('picture', e.target.value)}
              className="w-full bg-white/5 text-white px-3 py-2 rounded"
              placeholder="Profile picture URL"
            />
            <input
              type="text"
              value={data.profile.cvLink}
              onChange={(e) => updateProfile('cvLink', e.target.value)}
              className="w-full bg-white/5 text-white px-3 py-2 rounded"
              placeholder="CV Link"
            />
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Sections</h2>
            <button
              onClick={addSection}
              className="bg-white/10 hover:bg-white/20 px-3 py-1 rounded flex items-center gap-1 text-sm"
            >
              <Plus size={14} />
              Add Section
            </button>
          </div>

          {data.sections.map((section, sectionIndex) => (
            <div key={section.id} className="bg-white/5 rounded-lg p-6">
              <div className="flex items-start gap-3 mb-4">
                <button
                  onClick={() => toggleSection(section.id)}
                  className="text-white/50 hover:text-white mt-2"
                >
                  {expandedSections[section.id] ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                </button>

                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={section.name}
                      onChange={(e) => updateSection(sectionIndex, 'name', e.target.value)}
                      className="flex-1 bg-white/5 text-white px-3 py-2 rounded"
                      placeholder="Section name"
                    />
                    <input
                      type="text"
                      value={section.icon}
                      onChange={(e) => updateSection(sectionIndex, 'icon', e.target.value)}
                      className="w-32 bg-white/5 text-white px-3 py-2 rounded"
                      placeholder="Icon"
                    />
                    <button
                      onClick={() => deleteSection(sectionIndex)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              </div>

              {expandedSections[section.id] && (
                <div className="space-y-3 mt-4">
                  {section.items.map(item => renderItem(item, sectionIndex))}
                  
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => addItem(sectionIndex)}
                      className="text-sm text-white/50 hover:text-white flex items-center gap-1"
                    >
                      <Plus size={14} /> Add Item
                    </button>
                    <button
                      onClick={() => addFolder(sectionIndex)}
                      className="text-sm text-white/50 hover:text-white flex items-center gap-1"
                    >
                      <Plus size={14} /> Add Folder
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

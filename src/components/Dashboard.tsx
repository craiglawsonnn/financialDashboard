import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import MarketOverview from './MarketOverview';
import CurrencyConverter from './CurrencyConverter';

interface Tile {
  id: string;
  component: React.ReactNode;
}

const Dashboard: React.FC = () => {
  const [tiles, setTiles] = useState<Tile[]>([
    { id: 'market-overview', component: <MarketOverview /> },
    { id: 'currency-converter', component: <CurrencyConverter /> },
    { id: 'news-feed', component: <div>News Feed</div> },
    { id: 'portfolio-tracker', component: <div>Portfolio Tracker</div> },
  ]);
  const [fullscreenTile, setFullscreenTile] = useState<string | null>(null);

  const onDragEnd = (result: any) => {
    if (!result.destination) return;
    const items = Array.from(tiles);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setTiles(items);
  };

  const toggleFullscreen = (id: string) => {
    setFullscreenTile(fullscreenTile === id ? null : id);
  };

  return (
    <div className="dashboard">
      <h2>Dashboard</h2>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="tiles">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className={`dashboard-grid ${fullscreenTile ? 'has-fullscreen' : ''}`}
            >
              {tiles.map((tile, index) => (
                <Draggable key={tile.id} draggableId={tile.id} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={`module ${fullscreenTile === tile.id ? 'fullscreen' : ''}`}
                    >
                      <div className="module-header" {...provided.dragHandleProps}>
                        <span>☰</span>
                        <button onClick={() => toggleFullscreen(tile.id)}>
                          {fullscreenTile === tile.id ? '⤢' : '⤡'}
                        </button>
                      </div>
                      {tile.component}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default Dashboard;

import db from './db';
import { AgentEpisode, AgentPreferences, PatientAnalysis, InventoryItem } from '../types';

export interface MemoryDB {
  episodes: AgentEpisode[];
  preferences: Partial<AgentPreferences>;
  inventory: InventoryItem[];
  reports: PatientAnalysis[];
}

export async function getMemory(): Promise<MemoryDB> {
  try {
    const episodes = await db.agentEpisode.findMany({
      orderBy: { occurredAt: 'desc' },
    });
    
    let preferences = await db.agentPreference.findUnique({ where: { id: "1" } });
    if (!preferences) {
      preferences = await db.agentPreference.create({ data: { id: "1" } });
    }

    const inventory = await db.inventoryItem.findMany();
    const reports = await db.patientAnalysis.findMany({
      orderBy: { date: 'desc' },
    });

    return {
      episodes: episodes as any,
      preferences: preferences as any,
      inventory: inventory as any,
      reports: reports as any,
    };
  } catch (err) {
    console.error('Error reading memory from DB:', err);
    return {
      episodes: [],
      preferences: {
        fragranceSensitive: false,
        brandAvoidance: [],
      },
      inventory: [],
      reports: [],
    };
  }
}

export async function addEpisode(episode: Omit<AgentEpisode, 'id' | 'occurredAt'>) {
  try {
    const newEpisode = await db.agentEpisode.create({
      data: {
        episodeType: episode.episodeType,
        title: episode.title,
        summary: episode.summary,
        relatedEntityType: episode.relatedEntityType,
        relatedEntityId: episode.relatedEntityId,
        agentId: episode.agentId,
        isVisibleToUser: episode.isVisibleToUser,
      },
    });
    return newEpisode;
  } catch (err) {
    console.error('Error adding episode to DB:', err);
  }
}

export async function updatePreferences(prefs: Partial<AgentPreferences>) {
  try {
    await db.agentPreference.upsert({
      where: { id: "1" },
      update: {
        ...prefs,
        brandAvoidance: prefs.brandAvoidance ? JSON.stringify(prefs.brandAvoidance) : undefined,
      },
      create: {
        id: "1",
        ...prefs,
        brandAvoidance: prefs.brandAvoidance ? JSON.stringify(prefs.brandAvoidance) : undefined,
      },
    });
    
    // Automatically add an episode for this update
    await addEpisode({
      episodeType: 'preference_updated',
      title: 'Agent learned a new preference',
      summary: `Updated preferences`,
      isVisibleToUser: true,
      agentId: 'preference-learning-agent',
    });
  } catch (err) {
    console.error('Error updating preferences in DB:', err);
  }
}

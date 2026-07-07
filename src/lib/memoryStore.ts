import db from './db';
import { AgentEpisode, AgentPreferences, PatientAnalysis, InventoryItem } from '../types';

export interface MemoryDB {
  episodes: AgentEpisode[];
  preferences: Partial<AgentPreferences>;
  inventory: InventoryItem[];
  reports: PatientAnalysis[];
}

export async function getMemory(userId: string): Promise<MemoryDB> {
  try {
    const episodes = await (db as any).agentEpisode.findMany({
      where: { userId },
      orderBy: { occurredAt: 'desc' },
    });
    
    let preferences = await (db as any).agentPreference.findFirst({ where: { userId } });
    if (!preferences) {
      preferences = await (db as any).agentPreference.create({ data: { userId } });
    }

    const inventory = await (db as any).inventoryItem.findMany({ where: { userId } });
    const reports = await (db as any).patientAnalysis.findMany({
      where: { userId },
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

export async function addEpisode(userId: string, episode: Omit<AgentEpisode, 'id' | 'occurredAt'>) {
  try {
    const newEpisode = await (db as any).agentEpisode.create({
      data: {
        episodeType: episode.episodeType,
        title: episode.title,
        summary: episode.summary,
        relatedEntityType: episode.relatedEntityType,
        relatedEntityId: episode.relatedEntityId,
        agentId: episode.agentId,
        isVisibleToUser: episode.isVisibleToUser,
        userId,
      },
    });
    return newEpisode;
  } catch (err) {
    console.error('Error adding episode to DB:', err);
  }
}

export async function updatePreferences(userId: string, prefs: Partial<AgentPreferences>) {
  try {
    const existing = await (db as any).agentPreference.findFirst({ where: { userId } });
    const idToUpdate = existing?.id || 'new_id_will_be_generated';

    await (db as any).agentPreference.upsert({
      where: { id: idToUpdate },
      update: {
        ...prefs,
        brandAvoidance: prefs.brandAvoidance ? JSON.stringify(prefs.brandAvoidance) : undefined,
      },
      create: {
        userId,
        ...prefs,
        brandAvoidance: prefs.brandAvoidance ? JSON.stringify(prefs.brandAvoidance) : undefined,
      },
    });
    
    // Automatically add an episode for this update
    await addEpisode(userId, {
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

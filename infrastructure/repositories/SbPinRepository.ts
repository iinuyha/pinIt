import { Pin } from '@/domain/entities/Pin';
import { PinRepository } from '@/domain/repositories/PinRepository';
import { createClient } from '@/utils/supabase/server';

export class SbPinRepository implements PinRepository {
  async createPin(data: Pin): Promise<void> {
    const supabase = await createClient();

    // 입력받은 data를 DB에 저장하기 위해 스네이크케이스로 변환
    const formattedData = {
      place_name: data.placeName,
      capture_date: data.captureDate,
      address: data.address,
      latitude: data.latitude,
      longitude: data.longitude,
      tags: data.tags,
      description: data.description,
      image: data.image,
      user_id: data.userId,
    };
    // null로 받은 애들은 그냥 안보내줘도 됨 (안보내주면 DB에서 자동으로 기본값을 사용해서 저장함)

    const { error } = await supabase.from('pin').insert(formattedData).select();
    if (error) {
      throw new Error(error.message);
    }
  }
  async showPin(): Promise<Pin[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('pin')
      .select('*')
      .order('create_at', { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    // DB에서 받은 data를 사용하기 위해 카멜케이스로 변환
    const formattedData = data.map((pin) => ({
      id: pin.id,
      placeName: pin.place_name,
      captureDate: pin.capture_date,
      address: pin.address,
      latitude: pin.latitude,
      longitude: pin.longitude,
      tags: pin.tags,
      description: pin.description,
      image: pin.image,
      countLike: pin.count_like,
      createAt: pin.create_at,
      userId: pin.user_id,
    }));

    return formattedData || [];
  }
  async getPinById(pinId: string): Promise<Pin> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('pin')
      .select('*')
      .eq('id', pinId)
      .single(); // 단일 데이터 조회

    if (error) {
      throw new Error(error.message);
    }

    // DB에서 받은 데이터를 카멜케이스로 변환하여 반환
    return {
      id: data.id,
      placeName: data.place_name,
      captureDate: data.capture_date,
      address: data.address,
      latitude: data.latitude,
      longitude: data.longitude,
      tags: data.tags,
      description: data.description,
      image: data.image,
      countLike: data.count_like,
      createAt: data.create_at,
      userId: data.user_id,
    };
  }
  async findPinsByUserId(userId: string): Promise<Pin[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('pin')
      .select('*')
      .eq('user_id', userId) // user_id로 필터링
      .order('create_at', { ascending: false }); // 최신 순으로 정렬

    if (error) {
      throw new Error(error.message);
    }

    const formattedData = data.map((pin) => ({
      id: pin.id,
      placeName: pin.place_name,
      captureDate: pin.capture_date,
      address: pin.address,
      latitude: pin.latitude,
      longitude: pin.longitude,
      tags: pin.tags,
      description: pin.description,
      image: pin.image,
      countLike: pin.count_like,
      createAt: pin.create_at,
      userId: pin.user_id,
    }));

    return formattedData || [];
  }
  async findPinsByIdOrderByLike(pinId: string[] | []): Promise<Pin[]> {
    if (pinId.length === 0) return [];

    const supabase = await createClient();
    const { data, error } = await supabase
      .from('pin')
      .select('*')
      .in('id', pinId)
      .order('count_like', { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    const formattedData = data.map((pin) => ({
      id: pin.id,
      placeName: pin.place_name,
      captureDate: pin.capture_date,
      address: pin.address,
      latitude: pin.latitude,
      longitude: pin.longitude,
      tags: pin.tags,
      description: pin.description,
      image: pin.image,
      countLike: pin.count_like,
      createAt: pin.create_at,
      userId: pin.user_id,
    }));

    return formattedData || [];
  }
  async deletePin(pinId: string): Promise<void> {
    const supabase = await createClient();
    const { error } = await supabase.from('pin').delete().eq('id', pinId);

    if (error) {
      throw new Error(error.message);
    }
  }
  async updatePin(updateData: Pin): Promise<void> {
    const supabase = await createClient();

    const formattedData = {
      place_name: updateData.placeName,
      capture_date: updateData.captureDate,
      address: updateData.address,
      latitude: updateData.latitude,
      longitude: updateData.longitude,
      tags: updateData.tags,
      description: updateData.description,
      image: updateData.image,
    };
    console.log(formattedData);
    const { error } = await supabase
      .from('pin')
      .update(formattedData)
      .eq('id', updateData.id);

    if (error) {
      throw new Error(error.message);
    }
  }
  async searchPinsByKeyword(keyword: string): Promise<Pin[]> {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('pin')
      .select('*')
      .or(`place_name.ilike.%${keyword}%,address.ilike.%${keyword}%`)
      .order('create_at', { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return data.map((pin) => ({
      id: pin.id,
      placeName: pin.place_name,
      captureDate: pin.capture_date,
      address: pin.address,
      latitude: pin.latitude,
      longitude: pin.longitude,
      tags: pin.tags,
      description: pin.description,
      image: pin.image,
      countLike: pin.count_like,
      createAt: pin.create_at,
      userId: pin.user_id,
    }));
  }
  async deletePins(pinIds: string[]): Promise<void> {
    if (pinIds.length === 0) return;

    const supabase = await createClient();
    const { error } = await supabase.from('pin').delete().in('id', pinIds);

    if (error) {
      throw new Error(error.message);
    }
  }

  async getPinsByUserId(userId: string): Promise<Pin[]> {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('pin')
      .select('*')
      .eq('user_id', userId)
      .order('create_at', { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return data.map((pin) => ({
      id: pin.id,
      placeName: pin.place_name,
      captureDate: pin.capture_date,
      address: pin.address,
      latitude: pin.latitude,
      longitude: pin.longitude,
      tags: pin.tags,
      description: pin.description,
      image: pin.image,
      countLike: pin.count_like,
      createAt: pin.create_at,
      userId: pin.user_id,
    }));
  }

  async showBoundsPin(
    swLat: any,
    swLng: any,
    neLat: any,
    neLng: any,
  ): Promise<Pin[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('pin')
      .select('*')
      .gte('latitude', swLat) // 위도: swLat 이상
      .lte('latitude', neLat) // 위도: neLat 이하
      .gte('longitude', swLng) // 경도: swLng 이상
      .lte('longitude', neLng) // 경도: neLng 이하
      .order('create_at', { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    // DB에서 받은 data를 사용하기 위해 카멜케이스로 변환
    const formattedData = data.map((pin) => ({
      id: pin.id,
      placeName: pin.place_name,
      captureDate: pin.capture_date,
      address: pin.address,
      latitude: pin.latitude,
      longitude: pin.longitude,
      tags: pin.tags,
      description: pin.description,
      image: pin.image,
      countLike: pin.count_like,
      createAt: pin.create_at,
      userId: pin.user_id,
    }));

    return formattedData || [];
  }

  async findPinsById(pinId: string[] | []): Promise<Pin[]> {
    if (pinId.length === 0) return [];

    const supabase = await createClient();
    const { data, error } = await supabase
      .from('pin')
      .select('id, place_name, address, image, user_id, create_at')
      .in('id', pinId)
      .order('create_at', { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    const formattedData = data.map((pin) => ({
      id: pin.id,
      placeName: pin.place_name,
      address: pin.address,
      image: pin.image,
      createAt: pin.create_at,
      userId: pin.user_id,
    }));

    return formattedData || [];
  }
}

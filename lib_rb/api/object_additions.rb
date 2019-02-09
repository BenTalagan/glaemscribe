# From http://blade.nagaokaut.ac.jp/cgi-bin/scat.rb/ruby/ruby-list/43424
class Object
=begin
  def deep_clone
    return @deep_cloning_obj if @deep_cloning
      
    @deep_cloning_obj = clone
    @deep_cloning_obj.instance_variables.each do |var|
      val = @deep_cloning_obj.instance_variable_get(var)
      begin
        @deep_cloning = true
        val = val.deep_clone
      rescue TypeError
        next
      ensure
        @deep_cloning = false
      end
      @deep_cloning_obj.instance_variable_set(var, val)
    end
    deep_cloning_obj = @deep_cloning_obj
    @deep_cloning_obj = nil
    deep_cloning_obj
  end
=end
  
  def deep_clone(cache={})
    return cache[self] if cache.key?(self)

    copy = clone()
    cache[self] = copy

    copy.instance_variables.each do |var|
      val = instance_variable_get(var)
      begin
        val = val.deep_clone(cache)
      rescue TypeError
        next
      end
      copy.instance_variable_set(var, val)
    end

    return copy
  end  
end
